import type { AuthorableSectionType } from "@shared/config";

import type { SectionProps } from "../types";
import { AboutHeroSection } from "../variants/about-hero-section/AboutHeroSection";
import { AboutSection } from "../variants/about-section/AboutSection";
import { AccordionSection } from "../variants/accordion-section/AccordionSection";
import { AwardsSection } from "../variants/awards-section/AwardsSection";
import { BlogPageSection } from "../variants/blog-page-section/BlogPageSection";
import { CalendarLinkSection } from "../variants/calendar-link-section/CalendarLinkSection";
import { CareersSection } from "../variants/careers-section/CareersSection";
import { ClientsSection } from "../variants/clients-section/ClientsSection";
import { ContactFormSection } from "../variants/contact-form-section/ContactFormSection";
import { ContactInfoSection } from "../variants/contact-info-section/ContactInfoSection";
import { CTASection } from "../variants/cta-section/CTASection";
import { CustomSection } from "../variants/custom-section/CustomSection";
import { FAQSection } from "../variants/faq-section/FAQSection";
import { FeaturesSection } from "../variants/features-section/FeaturesSection";
import { GalleryGridSection } from "../variants/gallery-grid-section/GalleryGridSection";
import { HeadingSection } from "../variants/heading-section/HeadingSection";
import { HeroSection } from "../variants/hero-section/HeroSection";
import { HowToSection } from "../variants/how-to-section/HowToSection";
import { InstagramSection } from "../variants/instagram-section/InstagramSection";
import { LegalTextSection } from "../variants/legal-text-section/LegalTextSection";
import { MapSection } from "../variants/map-section/MapSection";
import { MenuSection } from "../variants/menu-section/MenuSection";
import { NewsletterSection } from "../variants/newsletter-section/NewsletterSection";
import { PinterestSection } from "../variants/pinterest-section/PinterestSection";
import { PlansSection } from "../variants/plans-section/PlansSection";
import { PostsGridSection } from "../variants/posts-grid-section/PostsGridSection";
import { PricingSection } from "../variants/pricing-section/PricingSection";
import { ProfileSection } from "../variants/profile-section/ProfileSection";
import { ProjectsSection } from "../variants/projects-section/ProjectsSection";
import { PropertySection } from "../variants/property-section/PropertySection";
import { QuickstartSection } from "../variants/quickstart-section/QuickstartSection";
import { ServicesSection } from "../variants/services-section/ServicesSection";
import { ShopItemsSection } from "../variants/shop-items-section/ShopItemsSection";
import { ShowcaseSection } from "../variants/showcase-section/ShowcaseSection";
import { SocialLinksSection } from "../variants/social-links-section/SocialLinksSection";
import { StatsSection } from "../variants/stats-section/StatsSection";
import { StudiesSection } from "../variants/studies-section/StudiesSection";
import { TableOfContentsSection } from "../variants/table-of-contents-section/TableOfContentsSection";
import { TabsSection } from "../variants/tabs-section/TabsSection";
import { TeamSection } from "../variants/team-section/TeamSection";
import { TechnicalSkillsSection } from "../variants/technical-skills-section/TechnicalSkillsSection";
import { TestimonialsSection } from "../variants/testimonials-section/TestimonialsSection";
import { TextSection } from "../variants/text-section/TextSection";
import { TimelineSection } from "../variants/timeline-section/TimelineSection";
import { VideoSection } from "../variants/video-section/VideoSection";
import { WorkExperienceSection } from "../variants/work-experience-section/WorkExperienceSection";
import { YouTubeSection } from "../variants/youtube-section/YouTubeSection";

export const sectionRenderers = {
  about: AboutSection,
  "about-hero": AboutHeroSection,
  accordion: AccordionSection,
  awards: AwardsSection,
  "blog-page": BlogPageSection,
  "calendar-link": CalendarLinkSection,
  careers: CareersSection,
  clients: ClientsSection,
  "contact-form": ContactFormSection,
  "contact-info": ContactInfoSection,
  cta: CTASection,
  custom: CustomSection,
  faq: FAQSection,
  features: FeaturesSection,
  "gallery-grid": GalleryGridSection,
  heading: HeadingSection,
  hero: HeroSection,
  "how-to": HowToSection,
  instagram: InstagramSection,
  "legal-text": LegalTextSection,
  map: MapSection,
  menu: MenuSection,
  newsletter: NewsletterSection,
  pinterest: PinterestSection,
  plans: PlansSection,
  "posts-grid": PostsGridSection,
  pricing: PricingSection,
  profile: ProfileSection,
  projects: ProjectsSection,
  property: PropertySection,
  quickstart: QuickstartSection,
  services: ServicesSection,
  "shop-items": ShopItemsSection,
  showcase: ShowcaseSection,
  "social-links": SocialLinksSection,
  stats: StatsSection,
  studies: StudiesSection,
  "table-of-contents": TableOfContentsSection,
  tabs: TabsSection,
  team: TeamSection,
  "technical-skills": TechnicalSkillsSection,
  testimonials: TestimonialsSection,
  text: TextSection,
  timeline: TimelineSection,
  video: VideoSection,
  "work-experience": WorkExperienceSection,
  youtube: YouTubeSection,
} satisfies Record<AuthorableSectionType, (props: SectionProps) => React.ReactNode>;
export function RenderSection(props: SectionProps) {
  const type = props.section.sectionType;
  if (!type) throw new Error("Choose a registered section type");
  const Component = sectionRenderers[type];
  return <Component {...props} />;
}
