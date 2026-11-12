import { RevealCardBase } from "@shared/ui/cards";

import { featuresStyles } from "./styles";

const steps = [
  {
    brief: "Sign in with Google to open your private workspace.",
    details:
      "Start with the work you already have. You can edit and preview your draft before publishing it.",
    id: "how-it-works",
    number: "04",
    title: "Open your studio",
  },
  {
    brief: "Import your CV or add your details by hand.",
    details:
      "Review what you import, choose the sections you want to show, and pick a layout, theme and languages that suit your work.",
    id: "build-portfolio",
    number: "05",
    title: "Put your story together",
  },
  {
    brief: "Choose a username and publish your portfolio when it’s ready.",
    details: "Share your portfolio link and download a PDF of your saved CV when you need a copy.",
    id: "share-portfolio",
    number: "06",
    title: "Share it when you’re ready",
  },
] as const;

export function HomeProcessSection() {
  return steps.map(({ brief, details, id, number, title }) => (
    <RevealCardBase
      backdrop="accent"
      brief={brief}
      className={featuresStyles.element9}
      heading={
        <>
          <span aria-hidden="true" className={featuresStyles.element6}>
            {number}
          </span>
          <h3>{title}</h3>
        </>
      }
      id={id}
      key={id}
      title={title}
    >
      <p>{details}</p>
    </RevealCardBase>
  ));
}
