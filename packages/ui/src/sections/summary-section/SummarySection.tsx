import "../../styles/components/sections/featured-summary.css";

import { ArrowUpRight, Download } from "lucide-react";

import { profile as fallback, getPortfolioCopy } from "@shared/config";

import { Background } from "../../layout/background";
import { summarySectionStyles } from "./styles";
import type { SummarySectionOptions } from "./types";

type FeaturedProject = NonNullable<SummarySectionOptions["profile"]>["projects"][number];

function FeaturedWork({ label, projects }: { label: string; projects: FeaturedProject[] }) {
  return (
    <aside aria-label={label} className="hero-featured-work">
      <h2>{label}</h2>
      <ol>
        {projects.map((project, index) => (
          <li key={project.id}>
            <a href={project.url || "#projects"}>
              <span aria-hidden="true" className="hero-project-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hero-project-copy">
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
