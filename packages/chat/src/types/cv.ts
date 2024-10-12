import { ChatMessage } from '@shared/lib'

export interface Skill {
  technology: string
  yearsOfExperience: string
}

export interface ContactInfo {
  phone: string
  email: string
  github: string
  linkedin: string
}

export interface Skill {
  technology: string
  yearsOfExperience: string
}

export interface Project {
  name: string
  company: string
  description: string
  usedSkills: string[]
}

export interface Education {
  degree: string
  university: string
  years: string
  gpa: string
  description: string
}

export interface Experience {
  position: string
  company: string
  years: string
  description: string
}

export interface Language {
  language: string
  proficiency: string
}

export interface Certificate {
  name: string
  date: string
  hours: string
}

export interface Reference {
  name: string
  position: string
  email: string
  contact: string
  feedback: string
}

export interface Achievement {
  title: string
  description: string
}

export interface Skills {
  frontend: Skill[]
  backend: Skill[]
  devops: Skill[]
  testing: Skill[]
  version_control: Skill[]
  data_visualization: Skill[]
  performance_optimization: Skill[]
}

type Name = string
type Nationality = string
type Location = string
type Summary = string

export type CVModel = {
  name: Name
  nationality: Nationality
  location: Location
  summary: Summary
  contact: ContactInfo
  skills: Skills
  projects: Project[]
  education: Education[]
  experience: Experience[]
  languages: Language[]
  certificates: Certificate[]
  references: Reference[]
  achievements: Achievement[]
}

export type CVModelKey = keyof CVModel

export type CVModelValue =
  | Skills
  | Project[]
  | Education[]
  | Experience[]
  | Language[]
  | Certificate[]
  | Reference[]
  | Achievement[]
  | ContactInfo
  | MessageWithoutModel
  | Name
  | Nationality
  | Location
  | Summary

export enum CVCategory {
  Projects = 'projects',
  Experience = 'experience',
  Skills = 'skills',
  Education = 'education',
  ContactInformation = 'contact',
  Greetings = 'greetings',
  OutOfTopic = 'outOfTopic',
  Languages = 'languages',
  Unknown = 'unknown',
  Certificates = 'certificates',
  References = 'references',
  Achievement = 'achievements'
}

export type MessageWithoutModel = {
  message: string
}

export type QuestionCategory = {
  category: CVCategory
  keywords: { word: string; weight?: number }[]
  model: CVModel[keyof CVModel] | ChatMessage
  weight?: number
}
