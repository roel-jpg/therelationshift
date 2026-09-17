import type { Metadata } from 'next';
import Link from 'next/link';
import { BookHead } from '@/components/BookHead';

export const metadata: Metadata = {
  title: 'Privacy statement',
  description: 'What The Relationshift® stores, why, for how long, and how you can see, download or delete it.',
};

const UPDATED = '17 September 2026';

// Written to match what the site actually does. When the site changes, this page changes with it.
export default function PrivacyPage() {
  return (
    <>
      <BookHead
        image="/media/site/single1.png"
        title="Privacy statement"
        text="What we store, why we store it, and how you can see, download or delete it at any moment."
      />
      <div className="register-form container dynamic-page">
        <div className="register-container legal">
          <p className="muted small">Last updated: {UPDATED}</p>

          <h3>In short</h3>
          <p>
            You can read this whole site without an account. If you create one, we store your first name, your e-mail
            address and the answers you write in the exercises. Those answers stay private: your partner sees them only
            for a day you explicitly share, and only once they have done that day themselves. We do not sell anything,
            we do not track you, and we use no advertising or analytics cookies. You can download or delete everything
            yourself from your account page.
          </p>

          <h3>Who is responsible</h3>
          <p>
            The Relationshift® is run by Rex B.V., Amsterdam, the Netherlands. Rex B.V. is the controller for the
            personal data described here. You can reach us at{' '}
            <a href="mailto:roel@therelationshift.com">roel@therelationshift.com</a> or through the{' '}
            <Link href="/support">support page</Link>.
          </p>

          <h3>What we store, why, and on what legal basis</h3>
          <h4>Your account</h4>
          <p>
            Your first name, your e-mail address, an encrypted version of your password (we never see the password
            itself), the date you signed up and the date you last signed in. We need this to give you an account and
            to keep you signed in. Legal basis: performance of the agreement with you (article 6(1)(b) GDPR).
          </p>

          <h4>Your answers, notes and ratings</h4>
          <p>
            Whatever you write in an exercise, the notes you add and the score you give a day. This is the heart of the
            programme: it lets you look back and, if you want, do the programme with your partner. These answers can
            say something about your relationship and your sex life. The GDPR treats that as a special category of
            personal data, which we may only store with your explicit consent. That is why you tick a separate box when
            you sign up. Legal basis: explicit consent (article 9(2)(a) GDPR). You can withdraw it at any time by
            deleting your answers or your account; withdrawing does not affect what happened before.
          </p>

          <h4>Sharing with your partner</h4>
          <p>
            Nothing is shared automatically. Per exercise you can tick a box to show your answer to the partner you are
            connected with. It becomes visible to them only once they have completed that same day, and it disappears
            again the moment you untick the box. Your partner always sees whether you completed a day, because that is
            what doing the programme together means. Legal basis: your consent, given per exercise.
          </p>

          <h4>Messages you send us</h4>
          <p>
            If you use the contact form we store your name, e-mail address and message so that we can answer you, and
            we receive a copy by e-mail. Legal basis: performance of the agreement and our legitimate interest in
            answering you (article 6(1)(b) and (f) GDPR).
          </p>

          <h4>Questions to Doctor Love</h4>
          <p>
            Doctor Love is the automated helper in the corner of the site. Your question is sent to a language model to
            produce an answer, and the conversation is not stored — not by us, and not in your browser. Please do not
            type anything in that window you would not want to leave your computer. Legal basis: your consent by
            starting the conversation.
          </p>

          <h4>Technical logs</h4>
          <p>
            Our hosting provider keeps short-lived server logs (IP address, time, page requested, error messages) to
            keep the site running and to spot abuse. We do not use them to build a picture of you. Legal basis: our
            legitimate interest in a secure, working website (article 6(1)(f) GDPR).
          </p>

          <h3>Cookies</h3>
          <p>
            One cookie, called <code>rs_session</code>. It keeps you signed in for thirty days and contains nothing but
            a signed reference to your account. There are no tracking cookies, no analytics cookies and no advertising
            cookies on this site, and we do not embed anything that sets them. Because this one cookie is strictly
            necessary for a service you asked for, no cookie banner is required. Signing out removes it.
          </p>

          <h3>Who else processes your data</h3>
          <p>
            We keep the circle small. These companies process data on our instructions, as processors, under a data
            processing agreement:
          </p>
          <ul>
            <li>Vercel — hosting of the website.</li>
            <li>Neon — the database in which your account and answers are stored.</li>
            <li>Resend — sending the e-mails we owe you, such as our reply to a message.</li>
            <li>Anthropic — producing Doctor Love's answers.</li>
          </ul>
          <p>
            Where any of them processes data outside the European Economic Area, that transfer is covered by the
            European Commission's standard contractual clauses. We do not sell or rent your data to anyone, and we
            share it with no one else unless the law obliges us to.
          </p>

          <h3>How long we keep it</h3>
          <p>
            Your account and your answers stay for as long as you want them: they are yours, and you decide when they
            go. If an account has not been used for twenty-four months we send a reminder to the e-mail address on it,
            and if it stays unused we delete the account and everything in it. Messages sent through the contact form
            are kept for up to twenty-four months so we can follow up on a conversation. Server logs are short-lived
            and are kept by our hosting provider for a matter of days.
          </p>

          <h3>Your rights</h3>
          <p>
            You have the right to see your data, to correct it, to have it deleted, to limit or object to what we do
            with it, to receive it in a portable form, and to withdraw a consent you gave. Two of those live as buttons
            on your <Link href="/account">account page</Link>: “Download my data” gives you a file with your account
            details and every answer, note, rating and sharing choice; “Delete my account and all my answers” removes
            everything for good. For anything else, write to us and we will answer within a month.
          </p>
          <p>
            If you think we handle your data badly, please tell us first — we would like the chance to fix it. You also
            have the right to complain to the Dutch data protection authority, the Autoriteit Persoonsgegevens
            (<a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener">autoriteitpersoonsgegevens.nl</a>).
          </p>

          <h3>How we protect it</h3>
          <p>
            The site is served over an encrypted connection. Passwords are stored as a salted hash, so they cannot be
            read back, not even by us. Your session cookie is signed and cannot be edited. Access to the database is
            limited to the two of us who run The Relationshift, and we look at individual answers only if you ask us to
            for support. Nothing you write is used to train any model.
          </p>

          <h3>Children</h3>
          <p>
            The programme is written for adults in a relationship. It is not meant for anyone under sixteen, and we do
            not knowingly keep accounts for them. If you believe a minor has created an account, let us know and we
            will remove it.
          </p>

          <h3>This is not therapy</h3>
          <p>
            The Relationshift® is a self-help programme, not care, therapy or medical advice, and neither is Doctor
            Love. If you are struggling — with your relationship, your health or your safety — please talk to your
            doctor or another professional. In an emergency, contact your local emergency services.
          </p>

          <h3>Changes</h3>
          <p>
            When the site changes, this page changes with it, and the date at the top moves. If a change matters to
            you — for instance if we ever start doing something new with your answers — we will ask you again rather
            than quietly assume.
          </p>
        </div>
      </div>
    </>
  );
}
