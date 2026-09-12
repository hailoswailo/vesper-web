import { Body, Card, Display, Eyebrow, Heading } from "@/components/ui";

// First-draft copy — no brand brief exists in the source repo to pull from,
// so this is written from the app's existing tone (application copy, the
// "someone reads every application by hand" line) rather than transcribed
// from anything official. Edit before this goes live.
export default function About() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <Eyebrow>About</Eyebrow>
      <Display className="mb-8">A discipline, not a hobby.</Display>

      <Body className="text-lg mb-6">
        Vesper takes its name from the evening prayer — a deliberate pause at the close of the day
        to take stock of what was actually done with it. That&rsquo;s the whole premise: most people
        know what a good life looks like in the abstract. Fewer build the daily architecture that
        actually produces one.
      </Body>

      <Body className="mb-6">
        Vesper is a community of changemakers, and the site is built around three things:{" "}
        <span className="text-brass">goal setting</span>,{" "}
        <span className="text-brass">accountability</span>, and{" "}
        <span className="text-brass">connection</span>. Members set real goals, track the
        habits that serve them, check in with themselves regularly, and support each other
        with resources and introductions along the way.
      </Body>

      <Body className="mb-10">
        It&rsquo;s invite-only and very selective by design. Every application is read by a
        person, not a bot — we&rsquo;re looking for people who are already serious about this, not
        people we need to convince.
      </Body>

      <Card>
        <Heading className="mb-3">The gathering</Heading>
        <Body>
          Once a month, members meet in person. It&rsquo;s the one place all of this stops being
          abstract — just people who take the same things seriously, in the same room.
        </Body>
      </Card>
    </section>
  );
}
