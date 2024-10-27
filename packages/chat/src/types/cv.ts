import { ChatCategoryType, ChatMessage } from '@shared/lib/types'

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

type Summary = {
  summary: string
}

export type PersonalInformation = {
  nationality: string
  location: string
  fullName: string
  birthDate: string
  age: string
}

export type TechnicalChallenge = {
  challenge: string
  solution: string
}

export type CVModel = {
  personalInformation: PersonalInformation
  overview: Summary
  contact: ContactInfo
  skills: Skills
  projects: Project[]
  education: Education[]
  experience: Experience[]
  languages: Language[]
  certifications: Certificate[]
  referrals: Reference[]
  achievements: Achievement[]
  characteristic: Character
  technicalChallenges: TechnicalChallenge[]
  workPreferences: {
    remote: string
    office: string
    hybrid: string
  }
}

export interface Character {
  strengths: string[]
  weaknesses: string[]
  leadership: {
    philosophy: string

    examples: string[]
  }
  teamwork: {
    philosophy: string

    examples: string[]
  }
  motivation: {
    shortTerm: string

    longTerm: string
  }
  communicationStyle: string

  problemSolvingPhilosophy: string

  adaptability: string

  innovation: string

  problemSolvingApproach: string
  workEthic: {
    punctuality: string
    dedication: string
    continuousLearning: string
  }
  resilience: string
  attentionToDetail: string
  careerGoals: {
    shortTerm: string
    longTerm: string
  }
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
  | Location
  | Summary
  | PersonalInformation

export type MessageWithoutModel = {
  message: string
}

export type ChatCategory = {
  category: ChatCategoryType
  keywords: { word: string; weight: number }[]
  model: CVModel[keyof CVModel] | ChatMessage
}
