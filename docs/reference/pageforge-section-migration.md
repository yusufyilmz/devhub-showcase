# PageForge section migration map

Source: yusufyilmz/pageforge-ai at 82ee192f7b9125bf42b899fb3e356c2be4983eb2, src/components/sections. All 42 *Section.tsx families are registered below. The native library also retains Custom, Services, YouTube, Instagram and Pinterest sections. This is a conversion to MyDevStudio data, themes and accessible primitives, not a copy of the Once UI runtime or a promise of pixel-identical animation.

Each folder has a renderer, a matching editor and index.tsx. Shared presenters implement the data-driven views; folders remain independently importable and discoverable. The registry is explicit and checked against the schema.

| PageForge source           | Package folder                                                                                              | Presentation |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------ |
| AboutHeroSection.tsx       | [src/about-hero-section](../../packages/assistant/src/components/sections/about-hero-section)               | hero         |
| AboutSection.tsx           | [src/about-section](../../packages/assistant/src/components/sections/about-section)                         | about        |
| AccordionSection.tsx       | [src/accordion-section](../../packages/assistant/src/components/sections/accordion-section)                 | accordion    |
| AwardsSection.tsx          | [src/awards-section](../../packages/assistant/src/components/sections/awards-section)                       | awards       |
| BlogPageSection.tsx        | [src/blog-page-section](../../packages/assistant/src/components/sections/blog-page-section)                 | posts        |
| CTASection.tsx             | [src/cta-section](../../packages/assistant/src/components/sections/cta-section)                             | cards        |
| CalendarLinkSection.tsx    | [src/calendar-link-section](../../packages/assistant/src/components/sections/calendar-link-section)         | links        |
| CareersSection.tsx         | [src/careers-section](../../packages/assistant/src/components/sections/careers-section)                     | careers      |
| ClientsSection.tsx         | [src/clients-section](../../packages/assistant/src/components/sections/clients-section)                     | clients      |
| ContactFormSection.tsx     | [src/contact-form-section](../../packages/assistant/src/components/sections/contact-form-section)           | contact      |
| ContactInfoSection.tsx     | [src/contact-info-section](../../packages/assistant/src/components/sections/contact-info-section)           | links        |
| FAQSection.tsx             | [src/faq-section](../../packages/assistant/src/components/sections/faq-section)                             | accordion    |
| FeaturesSection.tsx        | [src/features-section](../../packages/assistant/src/components/sections/features-section)                   | cards        |
| GalleryGridSection.tsx     | [src/gallery-grid-section](../../packages/assistant/src/components/sections/gallery-grid-section)           | gallery      |
| HeadingSection.tsx         | [src/heading-section](../../packages/assistant/src/components/sections/heading-section)                     | heading      |
| HeroSection.tsx            | [src/hero-section](../../packages/assistant/src/components/sections/hero-section)                           | hero         |
| HowToSection.tsx           | [src/how-to-section](../../packages/assistant/src/components/sections/how-to-section)                       | steps        |
| LegalTextSection.tsx       | [src/legal-text-section](../../packages/assistant/src/components/sections/legal-text-section)               | text         |
| MapSection.tsx             | [src/map-section](../../packages/assistant/src/components/sections/map-section)                             | map          |
| MenuSection.tsx            | [src/menu-section](../../packages/assistant/src/components/sections/menu-section)                           | menu         |
| NewsletterSection.tsx      | [src/newsletter-section](../../packages/assistant/src/components/sections/newsletter-section)               | newsletter   |
| PlansSection.tsx           | [src/plans-section](../../packages/assistant/src/components/sections/plans-section)                         | pricing      |
| PostsGridSection.tsx       | [src/posts-grid-section](../../packages/assistant/src/components/sections/posts-grid-section)               | posts        |
| PricingSection.tsx         | [src/pricing-section](../../packages/assistant/src/components/sections/pricing-section)                     | pricing      |
| ProfileSection.tsx         | [src/profile-section](../../packages/assistant/src/components/sections/profile-section)                     | profile      |
| ProjectsSection.tsx        | [src/projects-section](../../packages/assistant/src/components/sections/projects-section)                   | projects     |
| PropertySection.tsx        | [src/property-section](../../packages/assistant/src/components/sections/property-section)                   | property     |
| QuickstartSection.tsx      | [src/quickstart-section](../../packages/assistant/src/components/sections/quickstart-section)               | steps        |
| ShopItemsSection.tsx       | [src/shop-items-section](../../packages/assistant/src/components/sections/shop-items-section)               | shop         |
| ShowcaseSection.tsx        | [src/showcase-section](../../packages/assistant/src/components/sections/showcase-section)                   | gallery      |
| SocialLinksSection.tsx     | [src/social-links-section](../../packages/assistant/src/components/sections/social-links-section)           | links        |
| StatsSection.tsx           | [src/stats-section](../../packages/assistant/src/components/sections/stats-section)                         | statistics   |
| StudiesSection.tsx         | [src/studies-section](../../packages/assistant/src/components/sections/studies-section)                     | timeline     |
| TableOfContentsSection.tsx | [src/table-of-contents-section](../../packages/assistant/src/components/sections/table-of-contents-section) | toc          |
| TabsSection.tsx            | [src/tabs-section](../../packages/assistant/src/components/sections/tabs-section)                           | tabs         |
| TeamSection.tsx            | [src/team-section](../../packages/assistant/src/components/sections/team-section)                           | team         |
| TechnicalSkillsSection.tsx | [src/technical-skills-section](../../packages/assistant/src/components/sections/technical-skills-section)   | skills       |
| TestimonialsSection.tsx    | [src/testimonials-section](../../packages/assistant/src/components/sections/testimonials-section)           | quotes       |
| TextSection.tsx            | [src/text-section](../../packages/assistant/src/components/sections/text-section)                           | text         |
| TimelineSection.tsx        | [src/timeline-section](../../packages/assistant/src/components/sections/timeline-section)                   | timeline     |
| VideoSection.tsx           | [src/video-section](../../packages/assistant/src/components/sections/video-section)                         | video        |
| WorkExperienceSection.tsx  | [src/work-experience-section](../../packages/assistant/src/components/sections/work-experience-section)     | timeline     |

## Supporting files

Post, Posts and JsonBlogPage become helpers/aliases under blog-page-section; TableOfContents lives under table-of-contents-section; MasonryGridSectionlives under gallery-grid-section. Their behavior uses the same validated items and current page anchors. SCSS modules are replaced by the package stylesheet using MyDevStudio theme variables.

## Integration boundaries

- Contact forms open a visitor's email application with the entered subject/message. They do not claim to send mail. The PageForge source's placeholder endpoint handler and custom field schema are not imported.
- Newsletter sections link to an existing subscription page. No mailing list or delivery service is silently provisioned.
- Shop, pricing, plans, property and career actions link to the configured external page. Cart state, payments, bookings and third-party account integrations are outside this section package.
- Maps use latitude/longitude and load an OpenStreetMap iframe only after visitor interaction, with a source link. No map API key is required.
- Video sections support YouTube and direct MP4/WebM/Ogg files, including optional WebVTT captions. Arbitrary iframe HTML is rejected; other providers remain external links.
- Blog sections render authored/imported post data. They do not import executable MDX, filesystem fetch paths, generated routes or pagination backends.
- Heading sections use h2 within the portfolio's existing h1 hierarchy. Table of contents uses current stable anchors rather than source title-derived IDs.
- Layout choices are adapted to supported list/cards/gallery/masonry/carousel/timeline/steps/accordion/tabs/text views. Unsupported visual options, scripts and endpoints are reported in the import review. Additional descriptive source fields become escaped plain text where possible.

Sources remain the user's own canonical profile records. Compatible sections can select public projects, experience, education, skills, languages or About. Bindings resolve independently of the built-in section's selection and never make private projects public.
