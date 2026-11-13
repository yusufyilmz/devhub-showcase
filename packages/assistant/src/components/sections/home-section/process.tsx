import { RevealCardBase } from "@shared/ui/cards";

import { featuresStyles } from "./styles";

const steps = [
  {
    brief: "Sign in with Google to open your private workspace.",
    details:
      "Start with the work you already have. You can edit and preview your draft before publishing it.",
    id: "how-it-works",
    title: "Open your studio",
  },
  {
    brief: "Import your CV or add your details by hand.",
    details:
      "Work through Profile, Work experience, Projects and other sections in guided setup. Skip sections and return to them before saving your private draft.",
    id: "build-portfolio",
    title: "Put your story together",
  },
  {
    brief: "Choose a username and publish your portfolio when it’s ready.",
    details:
      "Preview the website and CV separately. Save a private draft, then choose when to publish and who can access your portfolio.",
    id: "share-portfolio",
    title: "Share it when you’re ready",
  },
] as const;

export function HomeProcessSection() {
  return steps.map(({ brief, details, id, title }) => (
    <RevealCardBase
      backdrop="accent"
      brief={brief}
      className={featuresStyles.element9}
      heading={<h3>{title}</h3>}
      id={id}
      key={id}
      title={title}
    >
      <p>{details}</p>
    </RevealCardBase>
  ));
}
