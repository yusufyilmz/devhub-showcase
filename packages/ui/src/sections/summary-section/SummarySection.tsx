import { profile as fallback, getPortfolioCopy } from "@shared/config";

import { summarySectionStyles } from "./styles";
import type { SummarySectionOptions } from "./types";

export function SummarySection({ profile = fallback }: SummarySectionOptions) {
  const text = getPortfolioCopy(profile.portfolioLanguage);
  const firstYear = profile.experiences.map((item) => item.start.slice(0, 4)).sort()[0];
  return (
    <section className={summarySectionStyles.element1} id="summary">
      <div aria-hidden="true" className={summarySectionStyles.element2} />
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
          <a className={summarySectionStyles.element9} href="#projects">
            {text.exploreWork} <span aria-hidden="true">↗</span>
          </a>
          <a className={summarySectionStyles.element10} href={`mailto:${profile.email}`}>
            {text.letsTalk}
          </a>
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
      <a className={summarySectionStyles.element12} href="#about-me">
        {text.scroll} <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
