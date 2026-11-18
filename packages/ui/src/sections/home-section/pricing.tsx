import { Button } from "../../buttons";
import { Card } from "../../cards";
import { List, ListItem } from "../../display";
import { Section } from "../section";
import { type CardButton, cardButton } from "./card-buttons";
import { libraryStyles, pricingStyles } from "./styles";
import type { HomePricingSectionOptions } from "./types";

type PricingCard = {
  articleClass?: string;
  button: CardButton;
  buttonClass: string;
  description?: string;
  eyebrow: string;
  eyebrowAs?: "span";
  eyebrowClass: string;
  id: string;
  note?: string;
  planDetails?: boolean;
  points?: readonly string[];
  title: string;
  variant?: "link" | "outline";
};

const cards: readonly PricingCard[] = [
  {
    articleClass: pricingStyles.element5,
    button: "studio",
    buttonClass: pricingStyles.element7,
    description: "A home for your work.",
    eyebrow: "FREE PREVIEW",
    eyebrowClass: pricingStyles.element9,
    id: "free",
    points: [
      "Your portfolio website and downloadable CV",
      "Every layout, plus themes and language settings",
      "Section library, custom sections and reusable templates",
      "Private drafts and explicit publication",
      "CV import when the extraction service is available",
    ],
    title: "Free",
    variant: "outline",
  },
  {
    articleClass: pricingStyles.element8,
    button: "pro",
    buttonClass: pricingStyles.element10,
    eyebrow: "SANDBOX PREVIEW",
    eyebrowClass: pricingStyles.element9,
    id: "pro",
    planDetails: true,
    points: [
      "Everything in Free",
      "Optional visitor chat grounded in your published work",
      "Private AI editing proposals with review and draft apply",
      "One assigned portfolio per account",
      "Usage tracking and subscription management",
    ],
    title: "Pro",
  },
];

function PricingPoints({ points }: { points: readonly string[] }) {
  return (
    <List listStyle="disc" noBorder>
      {points.map((point) => (
        <ListItem key={point}>{point}</ListItem>
      ))}
    </List>
  );
}

export function HomePricingSection({ action, children }: HomePricingSectionOptions) {
  return (
    <Section asChild>
      <section aria-labelledby="pricing-title" className={pricingStyles.element1} id="pricing">
        <div className={pricingStyles.element2}>
          <p className={pricingStyles.element3}>YOUR STUDIO, YOUR CHOICE</p>
          <h2 id="pricing-title">
            Start free.
            <br />
            <span>Add AI when you need it.</span>
          </h2>
          <p>
            Build a portfolio website and a CV together. Pro adds optional help for you and your
            visitors.
          </p>
        </div>
        <div className={pricingStyles.element4}>
          {cards.map((card) => {
            const button = cardButton(card.button, action);
            return (
              <Card asChild key={card.id} layout="plain" surface="portfolio">
                <article className={card.articleClass}>
                  {card.eyebrowAs === "span" ? (
                    <span className={card.eyebrowClass}>{card.eyebrow}</span>
                  ) : (
                    <p className={card.eyebrowClass}>{card.eyebrow}</p>
                  )}
                  <h3>{card.title}</h3>
                  {card.planDetails ? children : null}
                  {card.description ? <p>{card.description}</p> : null}
                  {card.points ? <PricingPoints points={card.points} /> : null}
                  <Button className={card.buttonClass} href={button.href} variant={card.variant}>
                    {button.label}
                  </Button>
                  {card.note ? <p className={libraryStyles.element9}>{card.note}</p> : null}
                </article>
              </Card>
            );
          })}
        </div>
        <p className={pricingStyles.element11}>
          Pro is currently a test environment. Use test cards; no real payments are enabled.
          Allowances count reserved attempts, including failed or uncertain requests. AI can make
          mistakes: review edits before saving. You choose whether to enable public chat.
        </p>
      </section>
    </Section>
  );
}
