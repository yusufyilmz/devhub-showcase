import { RevealCardBase } from "../../cards";
import { MasonryGrid } from "../../layout";
import { Section } from "../section";
import { featuresStyles } from "./styles";

type FeatureVisual = "cv" | "link" | "style";

type FeatureStep = {
  brief: string;
  details: string;
  heading: readonly string[];
  id: string;
  layout?: "main";
  points?: readonly string[];
  title: string;
  visual?: FeatureVisual;
};

const steps: readonly FeatureStep[] = [
  {
    brief:
      "Share what you’ve built, what you’ve learned and where you want to go. Your projects and experience take center stage.",
    details:
      "Give each project its context, bring your experience together, and let visitors explore the details at their own pace.",
    heading: ["A link that’s", "yours to share."],
    id: "portfolio-link",
    layout: "main",
    points: [
      "Your own shareable portfolio link",
      "Projects, experience and the story behind them",
      "A private draft until you choose to publish",
    ],
    title: "your own portfolio",
    visual: "link",
  },
  {
    brief: "Pair any layout with a theme, color palette and light or dark mode.",
    details:
      "Find a starting point that feels right, then make the details your own. Your content stays with you when you change the look.",
    heading: ["A little more you."],
    id: "portfolio-style",
    points: [
      "Portfolio themes, color palettes and light or dark mode",
      "Engineer, Designer, Consultant, Minimal, Trainer and Content creator layouts",
      "Separate portfolio and CV language settings",
    ],
    title: "your portfolio style",
    visual: "style",
  },
  {
    brief: "Keep your portfolio and CV connected through the same saved details.",
    details:
      "Choose what goes on your site and what goes into your PDF. CV formats include Classic, Editorial, Compact and two ATS-friendly layouts.",
    heading: ["One update. Both ready."],
    id: "portfolio-cv",
    title: "your portfolio and CV",
    visual: "cv",
  },
  {
    brief: "Sign in with Google to open your private workspace.",
    details:
      "Start with the work you already have. You can edit and preview your draft before publishing it.",
    heading: ["Open your studio"],
    id: "how-it-works",
    title: "Open your studio",
  },
  {
    brief: "Import your CV or add your details by hand.",
    details:
      "Work through Profile, Work experience, Projects and other sections in guided setup. Skip sections and return to them before saving your private draft.",
    heading: ["Put your story together"],
    id: "build-portfolio",
    title: "Put your story together",
  },
  {
    brief: "Choose a username and publish your portfolio when it’s ready.",
    details:
      "Preview the website and CV separately. Save a private draft, then choose when to publish and who can access your portfolio.",
    heading: ["Share it when you’re ready"],
    id: "share-portfolio",
    title: "Share it when you’re ready",
  },
  {
    brief: "Save roles and track applications in your private Job Hunter workspace.",
    details:
      "Save searches and review matches against your CV when discovery is configured. Prepare a tailored CV and cover letter for review, then apply on the employer’s site. With email forwarding configured, you can also review LinkedIn job alerts here.",
    heading: ["Find and track jobs"],
    id: "job-hunter",
    title: "Job Hunter",
  },
  {
    brief: "Set your Studio appearance and choose how the companion helps.",
    details:
      "Sign in to sync appearance and companion preferences across devices. Use the companion’s feature guide to explore the studio and keep track of what you’ve tried.",
    heading: ["Make the studio work for you"],
    id: "studio-preferences",
    title: "Studio preferences",
  },
];

function FeatureHeading({ heading, visual }: Pick<FeatureStep, "heading" | "visual">) {
  if (visual === "link") {
    return (
      <>
        <h3>
          {heading[0]}
          <br />
          {heading[1]}
        </h3>
        <div className={featuresStyles.element7}>
          <span aria-hidden="true">↗</span>
          <div>
            <small>YOUR PERSONAL LINK</small>
            <p>
              mydevstudio.vercel.app/<strong>yourname</strong>
            </p>
          </div>
        </div>
      </>
    );
  }

  if (visual === "style") {
    return (
      <>
        <div aria-hidden="true" className={featuresStyles.element11}>
          <span />
          <span />
          <span />
          <div>
            Aa<span>you.</span>
          </div>
        </div>
        <h3>{heading[0]}</h3>
      </>
    );
  }

  if (visual === "cv") {
    return (
      <div className={featuresStyles.element13}>
        <div aria-hidden="true" className={featuresStyles.element14}>
          <span>CV</span>↗
        </div>
        <div>
          <h3>{heading[0]}</h3>
        </div>
      </div>
    );
  }

  return <h3>{heading[0]}</h3>;
}

export function HomeFeaturesSection() {
  return (
    <Section asChild>
      <section aria-labelledby="features-title" className={featuresStyles.element1} id="features">
        <div className={featuresStyles.element2}>
          <h2 id="features-title">
            Build your portfolio and CV.
            <br />
            <span>Keep your job search organized.</span>
          </h2>
          <p>
            Set up your portfolio, choose how to share it, and keep job matches and application
            drafts in your private studio.
          </p>
        </div>
        <MasonryGrid columns={3}>
          {steps.map((step) => (
            <RevealCardBase
              backdrop="accent"
              brief={step.brief}
              className={step.layout === "main" ? featuresStyles.element5 : featuresStyles.element9}
              heading={<FeatureHeading heading={step.heading} visual={step.visual} />}
              id={step.id}
              key={step.id}
              title={step.title}
            >
              <p>{step.details}</p>
              {step.points ? (
                <ul className={featuresStyles.element8}>
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </RevealCardBase>
          ))}
        </MasonryGrid>
      </section>
    </Section>
  );
}
