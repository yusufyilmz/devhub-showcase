"use client";

import type { AuthorableSectionType } from "@shared/config";

import type { SectionEditorProps } from "../types";
import { AboutHeroSectionEditor } from "../variants/about-hero-section/AboutHeroSectionEditor";
import { AboutSectionEditor } from "../variants/about-section/AboutSectionEditor";
import { AccordionSectionEditor } from "../variants/accordion-section/AccordionSectionEditor";
import { AwardsSectionEditor } from "../variants/awards-section/AwardsSectionEditor";
import { BlogPageSectionEditor } from "../variants/blog-page-section/BlogPageSectionEditor";
import { CalendarLinkSectionEditor } from "../variants/calendar-link-section/CalendarLinkSectionEditor";
import { CareersSectionEditor } from "../variants/careers-section/CareersSectionEditor";
import { ClientsSectionEditor } from "../variants/clients-section/ClientsSectionEditor";
import { ContactFormSectionEditor } from "../variants/contact-form-section/ContactFormSectionEditor";
import { ContactInfoSectionEditor } from "../variants/contact-info-section/ContactInfoSectionEditor";
import { CTASectionEditor } from "../variants/cta-section/CTASectionEditor";
import { CustomSectionEditor } from "../variants/custom-section/CustomSectionEditor";
import { FAQSectionEditor } from "../variants/faq-section/FAQSectionEditor";
import { FeaturesSectionEditor } from "../variants/features-section/FeaturesSectionEditor";
import { GalleryGridSectionEditor } from "../variants/gallery-grid-section/GalleryGridSectionEditor";
import { HeadingSectionEditor } from "../variants/heading-section/HeadingSectionEditor";
import { HeroSectionEditor } from "../variants/hero-section/HeroSectionEditor";
import { HowToSectionEditor } from "../variants/how-to-section/HowToSectionEditor";
import { InstagramSectionEditor } from "../variants/instagram-section/InstagramSectionEditor";
import { LegalTextSectionEditor } from "../variants/legal-text-section/LegalTextSectionEditor";
import { MapSectionEditor } from "../variants/map-section/MapSectionEditor";
import { MenuSectionEditor } from "../variants/menu-section/MenuSectionEditor";
import { NewsletterSectionEditor } from "../variants/newsletter-section/NewsletterSectionEditor";
import { PinterestSectionEditor } from "../variants/pinterest-section/PinterestSectionEditor";
import { PlansSectionEditor } from "../variants/plans-section/PlansSectionEditor";
import { PostsGridSectionEditor } from "../variants/posts-grid-section/PostsGridSectionEditor";
import { PricingSectionEditor } from "../variants/pricing-section/PricingSectionEditor";
import { ProfileSectionEditor } from "../variants/profile-section/ProfileSectionEditor";
import { ProjectsSectionEditor } from "../variants/projects-section/ProjectsSectionEditor";
import { PropertySectionEditor } from "../variants/property-section/PropertySectionEditor";
import { QuickstartSectionEditor } from "../variants/quickstart-section/QuickstartSectionEditor";
import { ServicesSectionEditor } from "../variants/services-section/ServicesSectionEditor";
import { ShopItemsSectionEditor } from "../variants/shop-items-section/ShopItemsSectionEditor";
import { ShowcaseSectionEditor } from "../variants/showcase-section/ShowcaseSectionEditor";
import { SocialLinksSectionEditor } from "../variants/social-links-section/SocialLinksSectionEditor";
import { StatsSectionEditor } from "../variants/stats-section/StatsSectionEditor";
import { StudiesSectionEditor } from "../variants/studies-section/StudiesSectionEditor";
import { TableOfContentsSectionEditor } from "../variants/table-of-contents-section/TableOfContentsSectionEditor";
import { TabsSectionEditor } from "../variants/tabs-section/TabsSectionEditor";
import { TeamSectionEditor } from "../variants/team-section/TeamSectionEditor";
import { TechnicalSkillsSectionEditor } from "../variants/technical-skills-section/TechnicalSkillsSectionEditor";
import { TestimonialsSectionEditor } from "../variants/testimonials-section/TestimonialsSectionEditor";
import { TextSectionEditor } from "../variants/text-section/TextSectionEditor";
import { TimelineSectionEditor } from "../variants/timeline-section/TimelineSectionEditor";
import { VideoSectionEditor } from "../variants/video-section/VideoSectionEditor";
import { WorkExperienceSectionEditor } from "../variants/work-experience-section/WorkExperienceSectionEditor";
import { YouTubeSectionEditor } from "../variants/youtube-section/YouTubeSectionEditor";

export const sectionEditors = {
  about: AboutSectionEditor,
  "about-hero": AboutHeroSectionEditor,
  accordion: AccordionSectionEditor,
  awards: AwardsSectionEditor,
  "blog-page": BlogPageSectionEditor,
  "calendar-link": CalendarLinkSectionEditor,
  careers: CareersSectionEditor,
  clients: ClientsSectionEditor,
  "contact-form": ContactFormSectionEditor,
  "contact-info": ContactInfoSectionEditor,
  cta: CTASectionEditor,
  custom: CustomSectionEditor,
  faq: FAQSectionEditor,
  features: FeaturesSectionEditor,
  "gallery-grid": GalleryGridSectionEditor,
  heading: HeadingSectionEditor,
  hero: HeroSectionEditor,
  "how-to": HowToSectionEditor,
  instagram: InstagramSectionEditor,
  "legal-text": LegalTextSectionEditor,
  map: MapSectionEditor,
  menu: MenuSectionEditor,
  newsletter: NewsletterSectionEditor,
  pinterest: PinterestSectionEditor,
  plans: PlansSectionEditor,
  "posts-grid": PostsGridSectionEditor,
  pricing: PricingSectionEditor,
  profile: ProfileSectionEditor,
  projects: ProjectsSectionEditor,
  property: PropertySectionEditor,
  quickstart: QuickstartSectionEditor,
  services: ServicesSectionEditor,
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
  youtube: YouTubeSectionEditor,
} satisfies Record<AuthorableSectionType, (props: SectionEditorProps) => React.ReactNode>;

export function EditSection(props: SectionEditorProps) {
  const type = props.section.sectionType;
  if (!type) throw new Error("Choose a registered section type");
  const Component = sectionEditors[type];
  return <Component {...props} />;
}
