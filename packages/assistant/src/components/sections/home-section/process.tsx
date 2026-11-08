import { Section } from "@shared/ui/section";

import { StepList } from "../how-to-section/StepList";
import { processStyles } from "./styles";

export function HomeProcessSection() {
  return (
    <Section asChild>
      <section aria-labelledby="process-title" className={processStyles.element1} id="how-it-works">
        <div className={processStyles.element2}>
          <p className={processStyles.element3}>START WITH WHAT YOU HAVE</p>
          <h2 id="process-title">
            From a blank page
            <br />
            to <span>your own place.</span>
          </h2>
        </div>
        <StepList
          items={[
            {
              content: <p>Sign in with Google and start with your own private space.</p>,
              id: "open-studio",
              title: "Open your studio",
            },
            {
              content: (
                <p>
                  Import and review your CV or add details yourself. Choose sections, a layout,
                  theme and languages for a look that feels right.
                </p>
              ),
              id: "build-portfolio",
              title: "Put your story together",
            },
            {
              content: (
                <p>Choose your username, publish your portfolio and take your CV with you.</p>
              ),
              id: "share-portfolio",
              title: "Share it when you’re ready",
            },
          ]}
          landing
        />
      </section>
    </Section>
  );
}
