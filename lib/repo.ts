// Data access functions. All SQL lives here.
import { randomBytes } from 'node:crypto';
import { now, one, parseJson, query } from './db';

export const newId = () => randomBytes(12).toString('base64url');

// ---------- Types ----------

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  entitlement: 'FREE' | 'PREMIUM';
  isAdmin: boolean;
  coupleId: string | null;
};

export type Member = { id: string; firstName: string };

export type Exercise = {
  id: number;
  day: number;
  slug: string;
  title: string;
  type: string;
  goal: string;
  howTo: string;
  data: unknown;
  background: string | null;
  articles: { title: string; url: string }[];
  products: { name: string; url: string; author?: string }[];
  imageUrl: string | null;
  audioUrl: string | null;
  durationMin: number;
};

export type ExerciseSummary = Pick<Exercise, 'day' | 'title' | 'type' | 'durationMin' | 'imageUrl'>;

export type Answer = {
  exerciseId: number;
  data: unknown;
  reflection: string | null;
  rating: number | null;
  /** The author chose to show this answer to their partner once the partner has done the day too. */
  shared: boolean;
};

export type Invite = { id: string; token: string; senderId: string; acceptedAt: string | null };

// ---------- Row mappers ----------

type UserRow = { id: string; email: string; password_hash: string; first_name: string; entitlement: string; is_admin: number | boolean; couple_id: string | null };
const mapUser = (r: UserRow): User => ({
  id: r.id, email: r.email, passwordHash: r.password_hash, firstName: r.first_name,
  entitlement: r.entitlement === 'PREMIUM' ? 'PREMIUM' : 'FREE', isAdmin: !!r.is_admin, coupleId: r.couple_id,
});

type ExerciseRow = {
  id: number; day: number; slug: string; title: string; type: string; goal: string; how_to: string; data: string | null;
  background: string | null; articles: string | null; products: string | null; image_url: string | null; audio_url: string | null; duration_min: number | null;
};
const mapExercise = (r: ExerciseRow): Exercise => ({
  id: r.id, day: r.day, slug: r.slug, title: r.title, type: r.type, goal: r.goal, howTo: r.how_to,
  data: parseJson<unknown>(r.data, null), background: r.background,
  articles: parseJson(r.articles, []), products: parseJson(r.products, []),
  imageUrl: r.image_url, audioUrl: r.audio_url, durationMin: r.duration_min ?? 15,
});

// ---------- Users ----------

export async function findUserByEmail(email: string) {
  const r = await one<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
  return r ? mapUser(r) : null;
}

export async function findUserById(id: string) {
  const r = await one<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
  return r ? mapUser(r) : null;
}

export async function createUser(input: { email: string; passwordHash: string; firstName: string }) {
  const id = newId();
  const ts = now();
  await query(
    'INSERT INTO users (id, email, password_hash, first_name, entitlement, is_admin, couple_id, created_at, last_login_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
    [id, input.email, input.passwordHash, input.firstName, 'FREE', 0, null, ts, ts],
  );
  return (await findUserById(id))!;
}

export async function touchLogin(userId: string) {
  await query('UPDATE users SET last_login_at = $1 WHERE id = $2', [now(), userId]);
}

export async function setUserCouple(userId: string, coupleId: string | null) {
  await query('UPDATE users SET couple_id = $1 WHERE id = $2', [coupleId, userId]);
}

export async function coupleMembers(coupleId: string): Promise<Member[]> {
  const rows = await query<{ id: string; first_name: string }>('SELECT id, first_name FROM users WHERE couple_id = $1 ORDER BY created_at', [coupleId]);
  return rows.map((r) => ({ id: r.id, firstName: r.first_name }));
}

export async function createCouple() {
  const id = newId();
  await query('INSERT INTO couples (id, started_at) VALUES ($1, $2)', [id, now()]);
  return id;
}

// ---------- Invites ----------

type InviteRow = { id: string; token: string; sender_id: string; accepted_at: string | null };
const mapInvite = (r: InviteRow): Invite => ({ id: r.id, token: r.token, senderId: r.sender_id, acceptedAt: r.accepted_at });

export async function openInviteFor(senderId: string) {
  const r = await one<InviteRow>('SELECT * FROM invites WHERE sender_id = $1 AND accepted_at IS NULL ORDER BY created_at DESC', [senderId]);
  return r ? mapInvite(r) : null;
}

export async function createInviteRow(senderId: string) {
  const token = randomBytes(12).toString('base64url');
  await query('INSERT INTO invites (id, token, sender_id, created_at, accepted_at) VALUES ($1,$2,$3,$4,$5)', [newId(), token, senderId, now(), null]);
  return token;
}

export async function findInvite(token: string) {
  const r = await one<InviteRow>('SELECT * FROM invites WHERE token = $1', [token]);
  return r ? mapInvite(r) : null;
}

export async function markInviteAccepted(id: string) {
  await query('UPDATE invites SET accepted_at = $1 WHERE id = $2', [now(), id]);
}

// ---------- Exercises ----------

export async function listExercises(): Promise<ExerciseSummary[]> {
  const rows = await query<{ day: number; title: string; type: string; duration_min: number | null; image_url: string | null }>(
    'SELECT day, title, type, duration_min, image_url FROM exercises ORDER BY day',
  );
  return rows.map((r) => ({ day: r.day, title: r.title, type: r.type, durationMin: r.duration_min ?? 15, imageUrl: r.image_url }));
}

export async function getExercise(day: number) {
  const r = await one<ExerciseRow>('SELECT * FROM exercises WHERE day = $1', [day]);
  return r ? mapExercise(r) : null;
}

// ---------- Answers ----------

type AnswerRow = { exercise_id: number; data: string | null; reflection: string | null; rating: number | null; shared: number | boolean | null };
const mapAnswer = (r: AnswerRow): Answer => ({ exerciseId: r.exercise_id, data: parseJson<unknown>(r.data, null), reflection: r.reflection, rating: r.rating, shared: r.shared === true || Number(r.shared) === 1 });

export async function completedDays(userId: string): Promise<Set<number>> {
  const rows = await query<{ exercise_id: number }>('SELECT exercise_id FROM answers WHERE user_id = $1', [userId]);
  return new Set(rows.map((r) => Number(r.exercise_id)));
}

export async function getAnswer(userId: string, exerciseId: number) {
  const r = await one<AnswerRow>('SELECT exercise_id, data, reflection, rating, shared FROM answers WHERE user_id = $1 AND exercise_id = $2', [userId, exerciseId]);
  return r ? mapAnswer(r) : null;
}

export async function upsertAnswer(userId: string, exerciseId: number, data: unknown, reflection: string | null, rating: number | null, shared: boolean) {
  const ts = now();
  await query(
    `INSERT INTO answers (id, user_id, exercise_id, data, reflection, rating, shared, completed_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (user_id, exercise_id) DO UPDATE SET data = excluded.data, reflection = excluded.reflection, rating = excluded.rating, shared = excluded.shared, updated_at = excluded.updated_at`,
    [newId(), userId, exerciseId, data == null ? null : JSON.stringify(data), reflection, rating, shared ? 1 : 0, ts, ts],
  );
}

// ---------- Contact messages (support page) ----------

export async function createMessage(input: { name: string; email: string; message: string }) {
  const id = randomBytes(12).toString('hex');
  await query(
    'INSERT INTO messages (id, name, email, message, created_at) VALUES ($1, $2, $3, $4, $5)',
    [id, input.name, input.email, input.message, now()],
  );
  return id;
}

// ---------- Community numbers (map section on the home page) ----------

// The 2016–2020 programme ran on the old site and app; those exercises are not in this database.
// We start the counter at a rounded figure for that period and add everything done since.
export const EXERCISES_BASELINE = Number(process.env.EXERCISES_BASELINE ?? 20000);

// Below this many answers the "most popular" list would be noise, so we keep the 2016 top three.
const POPULAR_MIN_ANSWERS = 25;

export type CommunityStats = { exercisesCompleted: number; participants: number; topExercises: string[] };

export async function communityStats(): Promise<CommunityStats> {
  try {
    const [answers, users, popular] = await Promise.all([
      one<{ c: number }>('SELECT COUNT(*) AS c FROM answers'),
      one<{ c: number }>('SELECT COUNT(*) AS c FROM users'),
      query<{ title: string; c: number }>(
        `SELECT e.title AS title, COUNT(*) AS c FROM answers a
         JOIN exercises e ON e.id = a.exercise_id
         GROUP BY e.title ORDER BY c DESC, e.title LIMIT 3`,
      ),
    ]);
    const done = Number(answers?.c ?? 0);
    return {
      exercisesCompleted: EXERCISES_BASELINE + done,
      participants: Number(users?.c ?? 0),
      topExercises: done >= POPULAR_MIN_ANSWERS ? popular.map((p) => p.title) : [],
    };
  } catch (err) {
    console.error('[stats] falling back to the baseline', err);
    return { exercisesCompleted: EXERCISES_BASELINE, participants: 0, topExercises: [] };
  }
}
