import type { Metadata } from "next";

import { Body, Card, Display, Eyebrow, Heading } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about applying to Vesper, what membership includes, and how the community works.",
};

const FAQS = [
  {
    question: "What is Vesper?",
    answer:
      "Vesper is a private, invite-only community of changemakers built around goal setting, accountability, and connection. We provide resources to help members set real goals and actually follow through on them, and we gather in person once a month.",
  },
  {
    question: "Who is Vesper for?",
    answer:
      "People who are already serious about building a more intentional life and want a community that holds them to it — not people we need to convince to get started.",
  },
  {
    question: "How do I apply?",
    answer:
      "Fill out the application on our Apply page. It only takes a few minutes, and every application is read by a person, not a bot.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "We review every application individually. If it's a fit, we'll follow up with next steps, including how to join and what membership involves.",
  },
  {
    question: "Is Vesper really that selective?",
    answer:
      "Yes. Vesper is invite-only by design, and we keep the community intentionally small so it stays meaningful.",
  },
  {
    question: "What does membership include?",
    answer:
      "Resources for goal setting and accountability, a community that supports you with connections and resources, and a monthly in-person gathering. See our Membership page for details.",
  },
  {
    question: "How often do you meet in person?",
    answer:
      "Once a month. It's the one place where all of this stops being abstract — just people who take the same things seriously, in the same room.",
  },
  {
    question: "I have another question.",
    answer:
      "Include it in your application and we'll follow up directly.",
  },
];

export default function FAQ() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <Eyebrow>FAQ</Eyebrow>
      <Display className="mb-10">Questions, answered.</Display>

      <div className="flex flex-col gap-4">
        {FAQS.map((faq) => (
          <Card key={faq.question}>
            <Heading className="mb-2 text-xl">{faq.question}</Heading>
            <Body>{faq.answer}</Body>
          </Card>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
