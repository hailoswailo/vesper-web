import { Body, Button, Card, Display, Eyebrow, Heading } from "@/components/ui";

export default function Home() {
  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <Eyebrow>Vesper</Eyebrow>
        <Display className="mb-6 max-w-2xl">Life after six.</Display>
        <Body className="max-w-xl text-lg mb-10">
          Vesper is a community of changemakers — a very selective, invite-only group for people
          building a more intentional life. Every application is read by a person, not a bot.
        </Body>
        <div className="flex flex-wrap gap-4">
          <Button href="/apply">Apply</Button>
          <Button href="/about" variant="ghost">
            Learn More
          </Button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <Heading className="mb-10">What membership looks like.</Heading>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <p className="font-display text-2xl text-brass mb-2">Goal Setting</p>
            <Body>Resources to set real goals — and an actual plan for reaching them.</Body>
          </Card>
          <Card>
            <p className="font-display text-2xl text-brass mb-2">Accountability</p>
            <Body>Structure and support to help you follow through, not just start.</Body>
          </Card>
          <Card>
            <p className="font-display text-2xl text-brass mb-2">In Person</p>
            <Body>We gather in person once a week — not another app you scroll alone.</Body>
          </Card>
          <Card>
            <p className="font-display text-2xl text-brass mb-2">Selective</p>
            <Body>Invite-only. Every application is read by a person, not a bot.</Body>
          </Card>
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
