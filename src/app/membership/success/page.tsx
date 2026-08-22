import { Body, Button, Display, Eyebrow } from "@/components/ui";

export default function MembershipSuccess() {
  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <Eyebrow>Membership</Eyebrow>
      <Display className="mb-6">Welcome in.</Display>
      <Body className="mb-10">
        Your payment went through. It can take a minute for your membership status to update here —
        you&rsquo;re set either way.
      </Body>
      <Button href="/">Back Home</Button>
    </section>
  );
}
