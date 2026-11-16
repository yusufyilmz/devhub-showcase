# PageForge section migration map

Source: yusufyilmz/pageforge-ai at 82ee192f7b9125bf42b899fb3e356c2be4983eb2, src/components/sections. All 42 *Section.tsx families are registered below. The native library also retains Custom, Services, YouTube, Instagram and Pinterest sections. This is a conversion to MyDevStudio data, themes and accessible primitives, not a copy of the Once UI runtime or a promise of pixel-identical animation.

Each folder has a renderer, a matching editor and index.tsx. Shared presenters implement the data-driven views; folders remain independently importable and discoverable. The registry is explicit and checked against the schema.

| PageForge source           | Package folder                                                                            | Presentation |
| -------------------------- | ----------------------------------------------------------------------------------------- | ------------ |
| AboutHeroSection.tsx       | [src/about-hero-section](../../packages/ui/src/sections/about-hero-section)               | hero         |
| AboutSection.tsx           | [src/about-section](../../packages/ui/src/sections/about-section)                         | about        |
| AccordionSection.tsx       | [src/accordion-section](../../packages/ui/src/sections/accordion-section)                 | accordion    |
| AwardsSection.tsx          | [src/awards-section](../../packages/ui/src/sections/awards-section)                       | awards       |
| BlogPageSection.tsx        | [src/blog-page-section](../../packages/ui/src/sections/blog-page-section)                 | posts        |
| CTASection.tsx             | [src/cta-section](../../packages/ui/src/sections/cta-section)                             | cards        |
| CalendarLinkSection.tsx    | [src/calendar-link-section](../../packages/ui/src/sections/calendar-link-section)         | links        |
| CareersSection.tsx         | [src/careers-section](../../packages/ui/src/sections/careers-section)                     | careers      |
| ClientsSection.tsx         | [src/clients-section](../../packages/ui/src/sections/clients-section)                     | clients      |
| ContactFormSection.tsx     | [src/contact-form-section](../../packages/ui/src/sections/contact-form-section)           | contact      |
| ContactInfoSection.tsx     | [src/contact-info-section](../../packages/ui/src/sections/contact-info-section)           | links        |
| FAQSection.tsx             | [src/faq-section](../../packages/ui/src/sections/faq-section)                             | accordion    |
| FeaturesSection.tsx        | [src/features-section](../../packages/ui/src/sections/features-section)                   | cards        |
| GalleryGridSection.tsx     | [src/gallery-grid-section](../../packages/ui/src/sections/gallery-grid-section)           | gallery      |
| HeadingSection.tsx         | [src/heading-section](../../packages/ui/src/sections/heading-section)                     | heading      |
| HeroSection.tsx            | [src/hero-section](../../packages/ui/src/sections/hero-section)                           | hero         |
| HowToSection.tsx           | [src/how-to-section](../../packages/ui/src/sections/how-to-section)                       | steps        |
| LegalTextSection.tsx       | [src/legal-text-section](../../packages/ui/src/sections/legal-text-section)               | text         |
| MapSection.tsx             | [src/map-section](../../packages/ui/src/sections/map-section)                             | map          |
| MenuSection.tsx            | [src/menu-section](../../packages/ui/src/sections/menu-section)                           | menu         |
| NewsletterSection.tsx      | [src/newsletter-section](../../packages/ui/src/sections/newsletter-section)               | newsletter   |
| PlansSection.tsx           | [src/plans-section](../../packages/ui/src/sections/plans-section)                         | pricing      |
| PostsGridSection.tsx       | [src/posts-grid-section](../../packages/ui/src/sections/posts-grid-section)               | posts        |
| PricingSection.tsx         | [src/pricing-section](../../packages/ui/src/sections/pricing-section)                     | pricing      |
| ProfileSection.tsx         | [src/profile-section](../../packages/ui/src/sections/profile-section)                     | profile      |
| ProjectsSection.tsx        | [src/projects-section](../../packages/ui/src/sections/projects-section)                   | projects     |
| PropertySection.tsx        | [src/property-section](../../packages/ui/src/sections/property-section)                   | property     |
| QuickstartSection.tsx      | [src/quickstart-section](../../packages/ui/src/sections/quickstart-section)               | steps        |
| ShopItemsSection.tsx       | [src/shop-items-section](../../packages/ui/src/sections/shop-items-section)               | shop         |
| ShowcaseSection.tsx        | [src/showcase-section](../../packages/ui/src/sections/showcase-section)                   | gallery      |
| SocialLinksSection.tsx     | [src/social-links-section](../../packages/ui/src/sections/social-links-section)           | links        |
| StatsSection.tsx           | [src/stats-section](../../packages/ui/src/sections/stats-section)                         | statistics   |
| StudiesSection.tsx         | [src/studies-section](../../packages/ui/src/sections/studies-section)                     | timeline     |
| TableOfContentsSection.tsx | [src/table-of-contents-section](../../packages/ui/src/sections/table-of-contents-section) | toc          |
| TabsSection.tsx            | [src/tabs-section](../../packages/ui/src/sections/tabs-section)                           | tabs         |
| TeamSection.tsx            | [src/team-section](../../packages/ui/src/sections/team-section)                           | team         |
| TechnicalSkillsSection.tsx | [src/technical-skills-section](../../packages/ui/src/sections/technical-skills-section)   | skills       |
| TestimonialsSection.tsx    | [src/testimonials-section](../../packages/ui/src/sections/testimonials-section)           | quotes       |
| TextSection.tsx            | [src/text-section](../../packages/ui/src/sections/text-section)                           | text         |
| TimelineSection.tsx        | [src/timeline-section](../../packages/ui/src/sections/timeline-section)                   | timeline     |
| VideoSection.tsx           | [src/video-section](../../packages/ui/src/sections/video-section)                         | video        |
| WorkExperienceSection.tsx  | [src/work-experience-section](../../packages/ui/src/sections/work-experience-section)     | timeline     |

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
