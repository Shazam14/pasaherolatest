export const metadata = {
  title: "Privacy notice",
  description:
    "What Pasahero PH collects, why, where it is stored, and how to have it deleted.",
};

const h2 = "text-xl font-semibold tracking-tight mt-10 mb-3";
const p = "text-[color:var(--muted)] leading-relaxed mb-3";
const li = "text-[color:var(--muted)] leading-relaxed";

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em]">Privacy notice</h1>
      <p className="text-sm text-[color:var(--muted)] mt-2">Last updated 26 July 2026</p>

      <p className={`${p} mt-6 text-base`}>
        Pasahero PH is pre-launch. Nothing on this site can be booked, and we take no payments. The
        only personal data we hold is what you type into one of our three forms. This notice
        describes exactly what that is.
      </p>

      <h2 className={h2}>What we collect</h2>
      <p className={p}>When you request a corridor, we store:</p>
      <ul className="list-disc pl-5 space-y-1 mb-4">
        <li className={li}>the origin and destination you named</li>
        <li className={li}>the problem you selected, and any detail and frequency you added</li>
        <li className={li}>the mobile number or email you gave us so we can reply</li>
      </ul>
      <p className={p}>When you send feedback, we store your message, the page you sent it from, and your contact details if you chose to leave them.</p>
      <p className={p}>
        When you apply to carry passengers, we store whether you are an operator or a driver, your
        name or company name, your contact details, the route you run, and either your CPC number
        (operators) or your vehicle type and seat count (drivers), plus any notes you add.
      </p>
      <p className={p}>
        With every submission we also record the date and time and your browser&apos;s user-agent
        string, which identifies your browser and operating system but not you.
      </p>

      <h2 className={h2}>What we do not collect</h2>
      <p className={p}>
        There are no accounts and no passwords. We take no payment details, because payments are not
        built. We do not track your location. This site sets{" "}
        <strong className="text-[color:var(--foreground)]">no cookies</strong>, runs no analytics,
        and carries no advertising or third-party tracking scripts of any kind.
      </p>

      <h2 className={h2}>Why we collect it</h2>
      <p className={p}>
        Route requests decide which corridors we open and which operators we approach — that is the
        entire purpose of this stage. Applications let us contact you about carrying passengers.
        Feedback tells us what is broken. We reply using the contact details you give us, and we do
        not send marketing.
      </p>

      <h2 className={h2}>Where it is stored</h2>
      <p className={p}>
        Submissions are stored in a Neon Postgres database hosted on Amazon Web Services in{" "}
        <strong className="text-[color:var(--foreground)]">us-east-1 (United States)</strong>, and
        the site is served by Vercel from the same region. Your data therefore leaves the
        Philippines and is processed abroad. We remain accountable for it under the Data Privacy Act
        of 2012 (RA 10173) wherever it sits.
      </p>

      <h2 className={h2}>Who we share it with</h2>
      <p className={p}>
        Only the two providers who run our infrastructure: Vercel for hosting and Neon for the
        database. We do not sell your data, and we do not share it with advertisers, operators, or
        anyone else. If that ever changes we will say so here before it happens, not after.
      </p>

      <h2 className={h2}>How long we keep it</h2>
      <p className={p}>
        Until you ask us to delete it, or until it stops being useful for deciding where to launch.
        Ask and we will remove it.
      </p>

      <h2 className={h2}>Your rights</h2>
      <p className={p}>
        Under RA 10173 you may ask what we hold about you, have it corrected, have it erased, object
        to how we use it, and complain to the National Privacy Commission at{" "}
        <a
          href="https://privacy.gov.ph"
          className="text-[color:var(--foreground)] underline decoration-[color:var(--accent)] underline-offset-4"
        >
          privacy.gov.ph
        </a>
        .
      </p>

      <h2 className={h2}>Contact</h2>
      <p className={p}>
        Email{" "}
        <a
          href="mailto:privacy@pasaheroph.com"
          className="text-[color:var(--foreground)] underline decoration-[color:var(--accent)] underline-offset-4"
        >
          privacy@pasaheroph.com
        </a>{" "}
        for anything on this page, including deletion. A real person reads it.
      </p>
    </article>
  );
}
