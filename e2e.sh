#!/usr/bin/env bash
# End-to-end smoke test against a running build (npm run build first).
# Usage: SESSION_SECRET=x bash e2e.sh   — starts `next start` on :3100, exercises the main flows, stops it.
set -u
cd "$(dirname "$0")"
export NEXT_TELEMETRY_DISABLED=1 SESSION_SECRET=${SESSION_SECRET:-e2e-secret} NEXT_PUBLIC_SITE_URL=http://localhost:3100
rm -rf data/e2e.db*; export DATABASE_URL=file:./data/e2e.db
npx next start -p 3100 > e2e-server.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3100/ && break; sleep 1; done

# Resolve action ids from the compiled bundle (order of registration = order of export in lib/actions.ts)
IDS=$(grep -rho '(0,[a-zA-Z]\.A)([a-zA-Z]*,"[0-9a-f]\{42\}",null)' .next/server/chunks/*.js | sed 's/.*"\([0-9a-f]*\)".*/\1/' | awk '!seen[$0]++')
set -- $IDS
SIGNUP=$1; LOGIN=$2; LOGOUT=$3; INVITE=$4; ACCEPT=$5; LEAVE=$6; SAVE=$7; CONTACT=$8
B=http://localhost:3100
pass=0; fail=0
check() { if [ "$2" = "$3" ]; then echo "PASS $1"; pass=$((pass+1)); else echo "FAIL $1: got '$2' expected '$3'"; fail=$((fail+1)); fi; }

# useActionState-style action: args = [prevState, formData]
act_state() { # jar id url fields...
  local jar=$1 id=$2 url=$3; shift 3
  # progressive-enhancement encoding (no JS): $ACTION_REF_1 + $ACTION_1:0 metadata + $ACTION_1:1 bound args
  curl -s -o /dev/null -w "%{http_code}" -c "$jar" -b "$jar" -X POST "$url" \
    -F '$ACTION_REF_1=' -F "\$ACTION_1:0={\"id\":\"$id\",\"bound\":\"\$@1\"}" -F '$ACTION_1:1=[null]' "$@"
}
# plain form action: args = [formData]
act_form() { # jar id url fields...
  local jar=$1 id=$2 url=$3; shift 3
  curl -s -o /dev/null -w "%{http_code}" -c "$jar" -b "$jar" -X POST "$url" -F "\$ACTION_ID_$id=" "$@"
}
page() { curl -s -b "$1" "$2" | sed "s/<!-- -->//g"; }

rm -f a.jar b.jar c.jar
check "home 200" "$(curl -s -o /dev/null -w '%{http_code}' $B/)" 200
check "day 1 open" "$(curl -s $B/program/day/1 | grep -c 'Goals in life')" 1
check "day 2 needs login" "$(curl -s -o /dev/null -w '%{http_code}' $B/program/day/2)" 307

# Sign up user A
act_state a.jar $SIGNUP $B/signup -F firstName=Anna -F email=anna@example.com -F password=password1 >/dev/null
check "A logged in" "$(page a.jar $B/dashboard | grep -c 'Hi Anna')" 1
rm -f dup.jar; act_state dup.jar $SIGNUP $B/signup -F firstName=Anna -F email=anna@example.com -F password=password1 >/dev/null
check "duplicate signup gets no session" "$(n=$(grep -c rs_session dup.jar 2>/dev/null); echo ${n:-0})" 0

# A creates invite
act_form a.jar $INVITE $B/dashboard >/dev/null
TOKEN=$(page a.jar $B/dashboard | grep -o 'invite/[A-Za-z0-9_-]*' | head -1 | cut -d/ -f2)
check "invite token created" "$([ -n "$TOKEN" ] && echo yes)" yes
check "invite page shows sender" "$(curl -s $B/invite/$TOKEN | sed 's/<!-- -->//g' | grep -c 'Anna invited you')" 1

# B signs up via invite
act_state b.jar $SIGNUP "$B/signup?invite=$TOKEN" -F firstName=Bob -F email=bob@example.com -F password=password2 -F invite=$TOKEN >/dev/null
check "B paired with A" "$(page b.jar $B/dashboard | grep -c 'with <strong>Anna')" 1
check "A sees B" "$(page a.jar $B/dashboard | grep -c 'with <strong>Bob')" 1

# A answers day 2 (love language)
act_form a.jar $SAVE $B/program/day/2 -F day=2 -F 'data={"choices":["A","B","A"],"scores":{"A":2,"B":1,"C":0,"D":0,"E":0},"result":"A"}' -F reflection=nice -F rating=5 >/dev/null
check "A day 2 saved" "$(page a.jar $B/dashboard | grep -o 'class="hex done"' | wc -l | tr -d ' ')" 1
check "B sees A result" "$(page b.jar $B/program/day/2 | grep -c 'Words of Affirmation')" 1
check "A can edit day 2" "$(page a.jar $B/program/day/2 | grep -c 'Save changes')" 1

# Login / logout
act_form a.jar $LOGOUT $B/dashboard >/dev/null
check "A logged out" "$(page a.jar $B/account | head -c 0; curl -s -o /dev/null -w '%{http_code}' -b a.jar $B/account)" 307
act_state a.jar $LOGIN $B/login -F email=anna@example.com -F password=wrong >/dev/null
check "wrong password stays out" "$(curl -s -o /dev/null -w '%{http_code}' -b a.jar $B/account)" 307
act_state a.jar $LOGIN $B/login -F email=anna@example.com -F password=password1 >/dev/null
check "A logged in again" "$(page a.jar $B/account | grep -c 'anna@example.com')" 1

# Leave couple
act_form b.jar $LEAVE $B/account >/dev/null
check "B left couple" "$(page b.jar $B/account | grep -c 'Not connected yet')" 1

# Contact form on the support page (stores the message; mail is skipped without RESEND_API_KEY)
rows() { node -e "const{DatabaseSync}=require('node:sqlite');const d=new DatabaseSync('data/e2e.db');console.log(d.prepare('select count(*) c from messages').get().c)" 2>/dev/null; }
act_state c.jar $CONTACT $B/support -F name=Test -F email=test@example.com -F message='Hello there, a question' >/dev/null
check "contact message stored" "$(rows)" 1
act_state c.jar $CONTACT $B/support -F name=Test -F email=not-an-email -F message='Hello there, a question' >/dev/null
check "contact form rejects bad email" "$(rows)" 1
act_state c.jar $CONTACT $B/support -F name=Test -F email=test@example.com -F message='x' >/dev/null
check "contact form rejects empty message" "$(rows)" 1
act_state c.jar $CONTACT $B/support -F name=Bot -F email=bot@example.com -F message='buy my stuff now' -F website=http://spam.example >/dev/null
check "honeypot blocks spam" "$(rows)" 1

echo "---- $pass passed, $fail failed"
grep -iE "error|⨯" e2e-server.log | head -10
exit $fail
