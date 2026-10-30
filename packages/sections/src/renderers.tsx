import type { AuthorableSectionType } from '@shared/content'
import { AboutHeroSection } from './about-hero-section/AboutHeroSection'
import { AboutSection } from './about-section/AboutSection'
import { AccordionSection } from './accordion-section/AccordionSection'
import { AwardsSection } from './awards-section/AwardsSection'
import { BlogPageSection } from './blog-page-section/BlogPageSection'
import { CalendarLinkSection } from './calendar-link-section/CalendarLinkSection'
import { CareersSection } from './careers-section/CareersSection'
import { ClientsSection } from './clients-section/ClientsSection'
import { ContactFormSection } from './contact-form-section/ContactFormSection'
import { ContactInfoSection } from './contact-info-section/ContactInfoSection'
import { CTASection } from './cta-section/CTASection'
import { CustomSection } from './custom-section/CustomSection'
import { FAQSection } from './faq-section/FAQSection'
import { FeaturesSection } from './features-section/FeaturesSection'
import { GalleryGridSection } from './gallery-grid-section/GalleryGridSection'
import { HeadingSection } from './heading-section/HeadingSection'
import { HeroSection } from './hero-section/HeroSection'
import { HowToSection } from './how-to-section/HowToSection'
import { InstagramSection } from './instagram-section/InstagramSection'
import { LegalTextSection } from './legal-text-section/LegalTextSection'
import { MapSection } from './map-section/MapSection'
import { MenuSection } from './menu-section/MenuSection'
import { NewsletterSection } from './newsletter-section/NewsletterSection'
import { PinterestSection } from './pinterest-section/PinterestSection'
import { PlansSection } from './plans-section/PlansSection'
import { PostsGridSection } from './posts-grid-section/PostsGridSection'
import { PricingSection } from './pricing-section/PricingSection'
import { ProfileSection } from './profile-section/ProfileSection'
import { ProjectsSection } from './projects-section/ProjectsSection'
import { PropertySection } from './property-section/PropertySection'
import { QuickstartSection } from './quickstart-section/QuickstartSection'
import { ServicesSection } from './services-section/ServicesSection'
import { ShopItemsSection } from './shop-items-section/ShopItemsSection'
import { ShowcaseSection } from './showcase-section/ShowcaseSection'
import { SocialLinksSection } from './social-links-section/SocialLinksSection'
import { StatsSection } from './stats-section/StatsSection'
import { StudiesSection } from './studies-section/StudiesSection'
import { TableOfContentsSection } from './table-of-contents-section/TableOfContentsSection'
import { TabsSection } from './tabs-section/TabsSection'
import { TeamSection } from './team-section/TeamSection'
import { TechnicalSkillsSection } from './technical-skills-section/TechnicalSkillsSection'
import { TestimonialsSection } from './testimonials-section/TestimonialsSection'
import { TextSection } from './text-section/TextSection'
import { TimelineSection } from './timeline-section/TimelineSection'
import type { SectionProps } from './types'
import { VideoSection } from './video-section/VideoSection'
import { WorkExperienceSection } from './work-experience-section/WorkExperienceSection'
import { YouTubeSection } from './youtube-section/YouTubeSection'
export const sectionRenderers = {
  'about-hero': AboutHeroSection,
  about: AboutSection,
  accordion: AccordionSection,
  awards: AwardsSection,
  'blog-page': BlogPageSection,
  cta: CTASection,
  'calendar-link': CalendarLinkSection,
  careers: CareersSection,
  clients: ClientsSection,
  'contact-form': ContactFormSection,
  'contact-info': ContactInfoSection,
  faq: FAQSection,
  features: FeaturesSection,
  'gallery-grid': GalleryGridSection,
  heading: HeadingSection,
  hero: HeroSection,
  'how-to': HowToSection,
  'legal-text': LegalTextSection,
  map: MapSection,
  menu: MenuSection,
  newsletter: NewsletterSection,
  plans: PlansSection,
  'posts-grid': PostsGridSection,
  pricing: PricingSection,
  profile: ProfileSection,
  projects: ProjectsSection,
  property: PropertySection,
  quickstart: QuickstartSection,
  'shop-items': ShopItemsSection,
  showcase: ShowcaseSection,
  'social-links': SocialLinksSection,
  stats: StatsSection,
  studies: StudiesSection,
  'table-of-contents': TableOfContentsSection,
  tabs: TabsSection,
  team: TeamSection,
  'technical-skills': TechnicalSkillsSection,
  testimonials: TestimonialsSection,
  text: TextSection,
  timeline: TimelineSection,
  video: VideoSection,
  'work-experience': WorkExperienceSection,
  custom: CustomSection,
  services: ServicesSection,
  youtube: YouTubeSection,
  instagram: InstagramSection,
  pinterest: PinterestSection
} satisfies Record<
  AuthorableSectionType,
  (props: SectionProps) => React.ReactNode
>
export function RenderSection(props: SectionProps) {
  const type = props.section.sectionType
  if (!type) throw new Error('Choose a registered section type')
  const Component = sectionRenderers[type]
  return <Component {...props} />
}
