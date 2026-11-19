import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { ContactForm } from "../../forms/contact-form";
import { SectionFrame, sectionFrameProseClassName } from "./section-frame";
import { SectionHeading } from "./section-heading";

const densities = ["compact", "comfortable", "spacious"] as const;

const projects = [
  {
    copy: "A searchable archive for a local design studio, with long titles that wrap beside the preview image.",
    title: "Atlas archive",
  },
  {
    copy: "Editorial project pages with a reading column, captions, and a quiet set of actions.",
    title: "Field notes",
  },
  {
    copy: "A visual catalog that keeps image ratios and puts the inquiry action on the card.",
    title: "Harbor shop",
  },
];

function PageSample({ density }: { density: (typeof densities)[number] }) {
  const label = (name: string) => `spacing-${density}-${name}`;
  return (
    <div className="@container flex flex-col bg-background text-foreground">
      <div className="grid gap-2xl px-md @min-[64rem]:gap-3xl @min-[64rem]:px-xl">
        <SectionFrame
          context="composed"
          heading={
            <SectionHeading
              description="A product designer helping studios publish clear, durable work. This introduction stays in the page flow so the next section can begin on the shared rhythm, even when the sentence runs long enough to wrap on a narrow screen."
              eyebrow="Studio"
              id={label("hero-title")}
              level={2}
              title="Build a page that reads as one composition"
            />
          }
          id={label("hero")}
          width="contained"
        >
          <div className="flex flex-wrap gap-sm">
            <Button>Start a project</Button>
            <Button variant="outline">View selected work</Button>
          </div>
        </SectionFrame>

        <SectionFrame
          context="composed"
          heading={
            <SectionHeading
              description="Practice notes, not a second résumé."
              eyebrow="About"
              id={label("about-title")}
              level={2}
              title="About"
            />
          }
          id={label("about")}
          width="reading"
        >
          <div className={sectionFrameProseClassName}>
            <p>
              The studio works with independent teams who need a public home for the work they
              already have. Pages stay in the existing type and spacing tokens, so a pricing table
              can follow a project grid without inventing a new scale.
            </p>
            <p>
              Longer paragraphs stay inside the reading measure. Nested controls keep their own
              labels, and a card inside this column uses its own padding rather than borrowing the
              section gap.
            </p>
          </div>
          <article className="mt-lg grid gap-sm rounded-xl border border-border p-md @min-[64rem]:p-lg">
            <h3 className="m-0 text-base font-semibold">Currently</h3>
            <p className="m-0 text-muted-foreground">
              Available for a small number of portfolio and catalog projects.
            </p>
            <Button variant="outline">Read the notes</Button>
          </article>
        </SectionFrame>

        <SectionFrame
          context="composed"
          heading={
            <SectionHeading
              eyebrow="Work"
              id={label("work-title")}
              level={2}
              title="Selected projects"
            />
          }
          id={label("work")}
          width="contained"
        >
          <ul className="grid gap-md @min-[64rem]:grid-cols-3 @min-[64rem]:gap-lg">
            {projects.map((project) => (
              <li key={project.title}>
                <article className="grid h-full gap-sm rounded-xl border border-border bg-card p-md @min-[64rem]:p-lg">
                  <h3 className="m-0 text-base font-semibold">{project.title}</h3>
                  <p className="m-0 text-muted-foreground">{project.copy}</p>
                  <Button className="w-fit" variant="outline">
                    View project
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        </SectionFrame>
      </div>

      <SectionFrame
        context="composed"
        heading={
          <SectionHeading
            description="A full-bleed band keeps its own internal padding and does not add another gap above or below the neighboring sections."
            eyebrow="Announcement"
            id={label("band-title")}
            level={2}
            title="Now booking spring collaborations"
          />
        }
        id={label("band")}
        surface="muted"
        width="bleed"
      >
        <Button>Reserve a conversation</Button>
      </SectionFrame>

      <div className="grid gap-2xl px-md @min-[64rem]:gap-3xl @min-[64rem]:px-xl">
        <SectionFrame
          context="composed"
          heading={
            <SectionHeading eyebrow="FAQ" id={label("faq-title")} level={2} title="Questions" />
          }
          id={label("faq")}
          width="contained"
        >
          <div className="grid gap-sm">
            <details className="rounded-xl border border-border p-md @min-[64rem]:p-lg" open>
              <summary className="cursor-pointer font-semibold">
                Can I keep my current page?
              </summary>
              <p className="m-0 mt-sm max-w-prose text-muted-foreground">
                Yes. An existing portfolio stays on its current renderer until you choose this
                composition. Nothing is published by previewing the spacing.
              </p>
            </details>
            <details className="rounded-xl border border-border p-md @min-[64rem]:p-lg">
              <summary className="cursor-pointer font-semibold">
                What happens to private work?
              </summary>
              <p className="m-0 mt-sm max-w-prose text-muted-foreground">
                Hidden projects stay out of the public page. This sample only uses fictional studio
                notes.
              </p>
            </details>
          </div>
        </SectionFrame>

        <SectionFrame
          context="composed"
          heading={
            <SectionHeading
              description="Two ways to begin. Prices are examples, not an offer."
              eyebrow="Pricing"
              id={label("pricing-title")}
              level={2}
              title="Pricing"
            />
          }
          id={label("pricing")}
          surface="plain"
          width="contained"
        >
          <div className="grid gap-md @min-[64rem]:grid-cols-2 @min-[64rem]:gap-lg">
            {[
              ["Studio day", "€900", "One focused working session and a written summary."],
              ["Retainer", "€2,400", "A month of page updates, with a weekly review."],
            ].map(([name, price, copy]) => (
              <article
                className="grid gap-sm rounded-xl border border-border bg-card p-md @min-[64rem]:p-lg"
                key={name}
              >
                <h3 className="m-0 text-base font-semibold">{name}</h3>
                <p className="m-0 text-2xl font-semibold tracking-tight">{price}</p>
                <p className="m-0 text-muted-foreground">{copy}</p>
                <Button className="w-fit">Choose {name}</Button>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          context="composed"
          heading={
            <SectionHeading
              description="The form keeps its own field labels."
              eyebrow="Contact"
              id={label("contact-title")}
              level={2}
              title="Contact"
            />
          }
          id={label("contact")}
          surface="card"
          width="contained"
        >
          <ContactForm email="studio@example.com" language="en" preview />
        </SectionFrame>
      </div>
    </div>
  );
}

function SpacingContract() {
  return (
    <div className="grid gap-3xl">
      {densities.map((density) => (
        <section data-spacing={density} key={density}>
          <p className="px-md pb-md text-sm font-medium tracking-wide text-muted-foreground @min-[64rem]:px-xl">
            {density}
          </p>
          <PageSample density={density} />
        </section>
      ))}
    </div>
  );
}

const meta = {
  component: SpacingContract,
  globals: { brand: "sand", mode: "light", spacing: "comfortable" },
  parameters: { pageCanvas: true },
  title: "UI/Layout/Section/Spacing Contract",
} satisfies Meta<typeof SpacingContract>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MixedSections: Story = {};
export const SandDark: Story = { globals: { brand: "sand", mode: "dark" } };
