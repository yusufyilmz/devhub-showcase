import "./featured-summary.css";

import { ArrowUpRight, Download } from "lucide-react";

import { profile as fallback, getPortfolioCopy } from "@shared/config";
import { Background } from "@shared/ui/background";

import { summarySectionStyles } from "./styles";
import type { SummarySectionOptions } from "./types";

type FeaturedProject = NonNullable<SummarySectionOptions["profile"]>["projects"][number];

function FeaturedWork({ label, projects }: { label: string; projects: FeaturedProject[] }) {
  return (
    <aside
      aria-label={label}
      className="hero-featured-work [align-self:center] [padding:clamp(0.875rem,_3vw,_1.25rem)] [color:var(--foreground)] [background:linear-gradient(135deg,_color-mix(in_srgb,_var(--primary)_9%,_transparent),_transparent_60%),_var(--card)] [border:1px_solid_var(--border)] [border-radius:1rem] [box-shadow:0_1rem_2.25rem_color-mix(in_srgb,_var(--foreground)_18%,_transparent)] [&_ol]:[display:grid] [gap:0.5rem] [margin:0] [&_a]:[display:grid] [grid-template-columns:auto_minmax(0,_1fr)_auto] [gap:0.625rem] [align-items:center] [padding:0.625rem] [color:inherit] [text-decoration:none] [background:color-mix(in_srgb,_var(--background)_58%,_transparent)] [border-radius:0.625rem] [&_a:hover]:[background:var(--secondary)] [border-color:color-mix(in_srgb,_var(--primary)_55%,_transparent)] [&_a:focus-visible]:[background:var(--secondary)] [&_a_>_svg]:[color:var(--primary)] motion-safe:[&_a]:[transition:background_180ms_ease,_border-color_180ms_ease]"
    >
      <h2>{label}</h2>
      <ol>
        {projects.map((project, index) => (
          <li key={project.id}>
            <a href={project.url || "#projects"}>
              <span
                aria-hidden="true"
                className="hero-project-index [color:var(--primary)] [display:grid] [place-items:center] [width:2rem] [height:2rem] [font:0.6875rem_var(--font-geist-mono,_monospace)] [background:color-mix(in_srgb,_var(--primary)_10%,_transparent)] [border-radius:0.375rem]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hero-project-copy [display:grid] [gap:0.25rem] [overflow-wrap:anywhere] [&_strong]:[font-size:0.875rem] [font-weight:650] [line-height:1.3] [&_>_span]:[display:-webkit-box] [-webkit-box-orient:vertical] [overflow:hidden] [-webkit-line-clamp:2] [font-size:0.75rem] [line-height:1.45] [color:var(--muted-foreground)]">
                <strong>{project.name}</strong>
                <span>{project.description}</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export function SummarySection({ profile = fallback, featured = false }: SummarySectionOptions) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const firstYear = profile.experiences.map((item) => item.start.slice(0, 4)).sort()[0];
  const showProjects = profile.sectionSettings?.projects?.visible !== false;
  const projects =
    featured && showProjects
      ? profile.projects.filter((project) => project.public).slice(0, 2)
      : [];

  return (
    <section
      className={summarySectionStyles.element1}
      data-featured={featured || undefined}
      data-spotlight={projects.length > 0 || undefined}
      id="summary"
    >
      {featured ? (
        profile.hero ? null : (
          <Background
            aria-hidden="true"
            className="hero-featured-backdrop"
            effect="aurora"
            radius="none"
            variant="transparent"
          />
        )
      ) : (
        <div aria-hidden="true" className={summarySectionStyles.element2} />
      )}
      <div className={summarySectionStyles.element3}>
        <p className={summarySectionStyles.element4}>
          <span className={summarySectionStyles.element5} />
          {profile.location}
        </p>
        <h1>
          {profile.name}
          <span className={summarySectionStyles.element6}>.</span>
        </h1>
        <h2>{profile.title}</h2>
        <p className={summarySectionStyles.element7}>{profile.summary}</p>
        <div className={summarySectionStyles.element8}>
          {(!featured || projects.length > 0) && (
            <a className={summarySectionStyles.element9} href="#projects">
              {text.exploreWork} <span aria-hidden="true">↗</span>
            </a>
          )}
          {featured && profile.cvUrl && (
            <a className={summarySectionStyles.element10} href={profile.cvUrl}>
              <Download aria-hidden="true" size={15} /> {text.downloadCv}
            </a>
          )}
          {(!featured || profile.email) && (
            <a className={summarySectionStyles.element10} href={`mailto:${profile.email}`}>
              {text.letsTalk}
            </a>
          )}
        </div>
        <div className={summarySectionStyles.element11}>
          <span>
            {firstYear ? (
              <>
                {text.since} <strong>{firstYear}</strong>
              </>
            ) : (
              text.yourStory
            )}
          </span>
          <span>
            <strong>{profile.experiences.length}</strong> {text.roles}
          </span>
        </div>
      </div>
      {projects.length > 0 && <FeaturedWork label={text.selectedWork} projects={projects} />}
      {!featured && (
        <a className={summarySectionStyles.element12} href="#about-me">
          {text.scroll} <span aria-hidden="true">↓</span>
        </a>
      )}
    </section>
  );
}
