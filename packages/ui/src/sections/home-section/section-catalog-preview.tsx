import { type AuthorableSectionType, authorableSections } from "@shared/config";

/** Small illustrations, not live embedded portfolios or third-party media. */
const previewKindByView = {
  about: "text",
  accordion: "accordion",
  awards: "stats",
  cards: "cards",
  careers: "links",
  clients: "people",
  contact: "form",
  gallery: "gallery",
  heading: "text",
  hero: "hero",
  links: "links",
  list: "links",
  map: "map",
  menu: "links",
  newsletter: "form",
  posts: "cards",
  pricing: "pricing",
  profile: "people",
  projects: "gallery",
  property: "gallery",
  quotes: "quote",
  shop: "cards",
  skills: "skills",
  statistics: "stats",
  steps: "steps",
  tabs: "tabs",
  team: "people",
  text: "text",
  timeline: "timeline",
  toc: "links",
  video: "video",
} as const;

const previews = {
  accordion: (
    <div className="section-mini-list">
      <span>
        What I do <b>+</b>
      </span>
      <span>
        My approach <b>+</b>
      </span>
      <span>
        Let's connect <b>+</b>
      </span>
    </div>
  ),
  cards: (
    <div className="section-mini-cards">
      <span>
        <i />
        <b>Project one</b>
      </span>
      <span>
        <i />
        <b>Project two</b>
      </span>
    </div>
  ),
  form: (
    <div className="section-mini-form">
      <strong>Stay in the loop.</strong>
      <span>you@example.com</span>
      <i>Send message ↗</i>
    </div>
  ),
  gallery: (
    <div className="section-mini-gallery">
      <span />
      <span />
      <span />
    </div>
  ),
  hero: (
    <div className="section-mini-hero">
      <span className="section-mini-kicker">HELLO THERE</span>
      <strong>Make ideas real.</strong>
      <span className="section-mini-action">Explore work ↗</span>
    </div>
  ),
  links: (
    <div className="section-mini-list">
      <span>
        Explore work <b>↗</b>
      </span>
      <span>
        Services <b>↗</b>
      </span>
      <span>
        Get in touch <b>↗</b>
      </span>
    </div>
  ),
  map: (
    <div className="section-mini-map">
      <span className="section-mini-road" />
      <span className="section-mini-map-pin">●</span>
    </div>
  ),
  people: (
    <div className="section-mini-people">
      <div>
        <span>AM</span>
        <span>LC</span>
        <span>JR</span>
      </div>
      <strong>People first.</strong>
      <small>A creative team, working together.</small>
    </div>
  ),
  pricing: (
    <div className="section-mini-pricing">
      <span>
        <small>Starter</small>
        <strong>$29</strong>
        <i>Get started</i>
      </span>
      <span>
        <small>Pro</small>
        <strong>$59</strong>
        <i>Choose Pro</i>
      </span>
    </div>
  ),
  quote: (
    <div className="section-mini-quote">
      <strong>“</strong>
      <span>Brilliant work, from start to finish.</span>
      <small>— Happy collaborator</small>
    </div>
  ),
  skills: (
    <div className="section-mini-skills">
      <span>
        Design <i />
      </span>
      <span>
        Code <i />
      </span>
      <span>
        Strategy <i />
      </span>
    </div>
  ),
  stats: (
    <div className="section-mini-stats">
      <span>
        <strong>12+</strong>
        <small>Projects</small>
      </span>
      <span>
        <strong>98%</strong>
        <small>Happy clients</small>
      </span>
      <span>
        <strong>4.9</strong>
        <small>Rating</small>
      </span>
    </div>
  ),
  steps: (
    <div className="section-mini-steps">
      <span>
        <b>01</b> Discover
      </span>
      <span>
        <b>02</b> Design
      </span>
      <span>
        <b>03</b> Deliver
      </span>
    </div>
  ),
  tabs: (
    <div className="section-mini-tabs">
      <span className="section-mini-tab-active">Overview</span>
      <span>Work</span>
      <strong>Made with care.</strong>
    </div>
  ),
  text: (
    <div className="section-mini-copy">
      <strong>Thoughtful by design.</strong>
      <span>Building useful things for real people.</span>
      <span className="section-mini-line" />
    </div>
  ),
  timeline: (
    <div className="section-mini-timeline">
      <span>
        <b>2026</b> Product launch
      </span>
      <span>
        <b>2025</b> Design systems
      </span>
      <span>
        <b>2024</b> First milestone
      </span>
    </div>
  ),
  video: (
    <div className="section-mini-video">
      <span className="section-mini-play">▶</span>
      <span className="section-mini-duration">01:24</span>
    </div>
  ),
};

export function SectionCatalogPreview({ type }: { type: AuthorableSectionType }) {
  const kind = previewKindByView[authorableSections[type].view];

  return (
    <div
      aria-hidden="true"
      className={`section-catalog-preview section-catalog-preview--${kind}`}
      data-preview-kind={kind}
    >
      {previews[kind]}
    </div>
  );
}
