"use client";
import type { AuthorableSectionType } from "@shared/content";
import { AboutHeroSectionEditor } from "./about-hero-section/AboutHeroSectionEditor";
import { AboutSectionEditor } from "./about-section/AboutSectionEditor";
import { AccordionSectionEditor } from "./accordion-section/AccordionSectionEditor";
import { AwardsSectionEditor } from "./awards-section/AwardsSectionEditor";
import { BlogPageSectionEditor } from "./blog-page-section/BlogPageSectionEditor";
import { CalendarLinkSectionEditor } from "./calendar-link-section/CalendarLinkSectionEditor";
import { CareersSectionEditor } from "./careers-section/CareersSectionEditor";
import { ClientsSectionEditor } from "./clients-section/ClientsSectionEditor";
import { ContactFormSectionEditor } from "./contact-form-section/ContactFormSectionEditor";
import { ContactInfoSectionEditor } from "./contact-info-section/ContactInfoSectionEditor";
import { CTASectionEditor } from "./cta-section/CTASectionEditor";
import { CustomSectionEditor } from "./custom-section/CustomSectionEditor";
import { FAQSectionEditor } from "./faq-section/FAQSectionEditor";
import { FeaturesSectionEditor } from "./features-section/FeaturesSectionEditor";
import { GalleryGridSectionEditor } from "./gallery-grid-section/GalleryGridSectionEditor";
import { HeadingSectionEditor } from "./heading-section/HeadingSectionEditor";
import { HeroSectionEditor } from "./hero-section/HeroSectionEditor";
import { HowToSectionEditor } from "./how-to-section/HowToSectionEditor";
import { InstagramSectionEditor } from "./instagram-section/InstagramSectionEditor";
import { LegalTextSectionEditor } from "./legal-text-section/LegalTextSectionEditor";
import { MapSectionEditor } from "./map-section/MapSectionEditor";
import { MenuSectionEditor } from "./menu-section/MenuSectionEditor";
import { NewsletterSectionEditor } from "./newsletter-section/NewsletterSectionEditor";
import { PinterestSectionEditor } from "./pinterest-section/PinterestSectionEditor";
import { PlansSectionEditor } from "./plans-section/PlansSectionEditor";
import { PostsGridSectionEditor } from "./posts-grid-section/PostsGridSectionEditor";
import { PricingSectionEditor } from "./pricing-section/PricingSectionEditor";
import { ProfileSectionEditor } from "./profile-section/ProfileSectionEditor";
import { ProjectsSectionEditor } from "./projects-section/ProjectsSectionEditor";
import { PropertySectionEditor } from "./property-section/PropertySectionEditor";
import { QuickstartSectionEditor } from "./quickstart-section/QuickstartSectionEditor";
import { ServicesSectionEditor } from "./services-section/ServicesSectionEditor";
import { ShopItemsSectionEditor } from "./shop-items-section/ShopItemsSectionEditor";
import { ShowcaseSectionEditor } from "./showcase-section/ShowcaseSectionEditor";
import { SocialLinksSectionEditor } from "./social-links-section/SocialLinksSectionEditor";
import { StatsSectionEditor } from "./stats-section/StatsSectionEditor";
import { StudiesSectionEditor } from "./studies-section/StudiesSectionEditor";
import { TableOfContentsSectionEditor } from "./table-of-contents-section/TableOfContentsSectionEditor";
import { TabsSectionEditor } from "./tabs-section/TabsSectionEditor";
import { TeamSectionEditor } from "./team-section/TeamSectionEditor";
import { TechnicalSkillsSectionEditor } from "./technical-skills-section/TechnicalSkillsSectionEditor";
import { TestimonialsSectionEditor } from "./testimonials-section/TestimonialsSectionEditor";
import { TextSectionEditor } from "./text-section/TextSectionEditor";
import { TimelineSectionEditor } from "./timeline-section/TimelineSectionEditor";
import type { SectionEditorProps } from "./types";
import { VideoSectionEditor } from "./video-section/VideoSectionEditor";
import { WorkExperienceSectionEditor } from "./work-experience-section/WorkExperienceSectionEditor";
import { YouTubeSectionEditor } from "./youtube-section/YouTubeSectionEditor";
export const sectionEditors = {
  "about-hero": AboutHeroSectionEditor,
  about: AboutSectionEditor,
  accordion: AccordionSectionEditor,
  awards: AwardsSectionEditor,
  "blog-page": BlogPageSectionEditor,
  cta: CTASectionEditor,
  "calendar-link": CalendarLinkSectionEditor,
  careers: CareersSectionEditor,
  clients: ClientsSectionEditor,
  "contact-form": ContactFormSectionEditor,
  "contact-info": ContactInfoSectionEditor,
  faq: FAQSectionEditor,
  features: FeaturesSectionEditor,
  "gallery-grid": GalleryGridSectionEditor,
  heading: HeadingSectionEditor,
  hero: HeroSectionEditor,
  "how-to": HowToSectionEditor,
  "legal-text": LegalTextSectionEditor,
  map: MapSectionEditor,
  menu: MenuSectionEditor,
  newsletter: NewsletterSectionEditor,
  plans: PlansSectionEditor,
  "posts-grid": PostsGridSectionEditor,
  pricing: PricingSectionEditor,
  profile: ProfileSectionEditor,
  projects: ProjectsSectionEditor,
  property: PropertySectionEditor,
  quickstart: QuickstartSectionEditor,
  "shop-items": ShopItemsSectionEditor,
  showcase: ShowcaseSectionEditor,
  "social-links": SocialLinksSectionEditor,
  stats: StatsSectionEditor,
  studies: StudiesSectionEditor,
  "table-of-contents": TableOfContentsSectionEditor,
  tabs: TabsSectionEditor,
  team: TeamSectionEditor,
  "technical-skills": TechnicalSkillsSectionEditor,
  testimonials: TestimonialsSectionEditor,
  text: TextSectionEditor,
  timeline: TimelineSectionEditor,
  video: VideoSectionEditor,
  "work-experience": WorkExperienceSectionEditor,
  custom: CustomSectionEditor,
  services: ServicesSectionEditor,
  youtube: YouTubeSectionEditor,
  instagram: InstagramSectionEditor,
  pinterest: PinterestSectionEditor,
} satisfies Record<
  AuthorableSectionType,
  (props: SectionEditorProps) => React.ReactNode
>;
export function EditSection(props: SectionEditorProps) {
  const type = props.section.sectionType;
  if (!type) throw new Error("Choose a registered section type");
  const Component = sectionEditors[type];
  return <Component {...props} />;
}
