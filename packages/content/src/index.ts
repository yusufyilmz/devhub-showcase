import { chatMessages } from './chat-messages'
import { aboutSection } from './site-copy/about'
import { chat } from './site-copy/chat'
import { cta } from './site-copy/cta'
import { cvSection } from './site-copy/cv'
import { errorPage } from './site-copy/errorPage'
import { footer } from './site-copy/footer'
import { header } from './site-copy/header'
import { metadata } from './site-copy/meta-data'
import { navbar } from './site-copy/navbar'
import { notFoundPage } from './site-copy/notFoundPage'
import { notifications } from './site-copy/notifications'
import { project } from './site-copy/project'
import { structuredData } from './site-copy/structured-data'

export const copy = {
  project,
  notifications,
  cta,
  header,
  footer,
  cvSection,
  navbar,
  notFoundPage,
  errorPage,
  chatMessages,
  chat,
  aboutSection,
  metadata,
  structuredData
}

export type { Language, PortfolioMessages } from './languages'
export { formatPortfolioPeriod, getPortfolioCopy, languages } from './languages'
export type { PortfolioSectionId } from './portfolio-sections'
export {
  getPortfolioSectionOrder,
  portfolioSectionIds,
  portfolioSectionLabels
} from './portfolio-sections'
export type { CvLayout, PortfolioType } from './portfolio-types'
export { cvLayouts, portfolioTypes } from './portfolio-types'
export type { PortfolioProfile } from './profile'
export { profile } from './profile'
export type { ColorMode, PortfolioTheme } from './themes'
export {
  getPortfolioThemeVariables,
  getPreviewAccent,
  getThemePalette,
  portfolioAccents,
  portfolioThemes
} from './themes'
