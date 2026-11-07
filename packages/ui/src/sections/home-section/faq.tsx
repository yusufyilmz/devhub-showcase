import { copy } from "@shared/config";

import { FAQBlock } from "../faq-section/FAQBlock";

export function HomeFAQSection() {
  return (
    <FAQBlock
      eyebrow="A FEW THINGS TO KNOW"
      headingId="questions-title"
      id="questions"
      items={copy.faq.map(([question, answer]) => ({
        content: <p>{answer}</p>,
        id: question,
        title: question,
      }))}
      title={
        <>
          Make yourself
          <br />
          <span>at home.</span>
        </>
      }
      variant="landing"
    />
  );
}
