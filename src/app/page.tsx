import { Body, Button, Card, Display, Eyebrow, Heading } from "@/components/ui";

const PILLARS = [
  { name: "Faith", description: "The foundation the other three sit on." },
  { name: "Food & Fitness", description: "Discipline over your own body, first." },
  { name: "Relationships", description: "The people you're building a life alongside." },
  { name: "Work", description: "The vocation you're actually called to." },
];

export default function Home() {
  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <Eyebrow>Vesper</Eyebrow>
        <Display className="mb-6 max-w-2xl">Life after six.</Display>
        <Body className="max-w-xl text-lg mb-10">
          A private, invite-only community for people taking their faith, bodies, relationships, and
          work seriously. Every application is read by a person, not a bot.
        </Body>
        <div className="flex flex-wrap gap-4">
          <Button href="/apply">Apply</Button>
          <Button href="/about" variant="ghost">
            Learn More
          </Button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <Heading className="mb-10">Four pillars.</Heading>
        <div className="grid sm:grid-cols-2 gap-4">
          {PILLARS.map((p) => (
            <Card key={p.name}>
              <p className="font-display text-2xl text-brass mb-2">{p.name}</p>
              <Body>{p.description}</Body>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Heading className="mb-2">Ready to apply?</Heading>
            <Body>Tell us who you are. Someone reads every application by hand.</Body>
          </div>
          <Button href="/apply" className="shrink-0">
            Apply Now
          </Button>
        </Card>
      </section>
    </>
  );
}
