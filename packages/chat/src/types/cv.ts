import type { ChatCategoryType, ChatMessage } from "@shared/lib/types";

export interface Skill {
  technology: string;
  yearsOfExperience: string;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  phone: string;
}

export interface Project {
  company: string;
  description: string;
  name: string;
  usedSkills: string[];
}

export interface Education {
  degree: string;
  description: string;
  gpa: string;
  university: string;
  years: string;
}

export interface Experience {
  company: string;
  description: string;
  position: string;
  years: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Certificate {
  date: string;
  hours: string;
  name: string;
}

export interface Reference {
  contact: string;
  email: string;
  feedback: string;
  name: string;
  position: string;
}

export interface Achievement {
  description: string;
  title: string;
}

export interface Skills {
  backend: Skill[];
  data_visualization: Skill[];
  devops: Skill[];
  frontend: Skill[];
  groups?: Record<string, string[]>;
  performance_optimization: Skill[];
  testing: Skill[];
  version_control: Skill[];
}

type Summary = {
  summary: string;
};

export type PersonalInformation = {
  nationality: string;
  location: string;
  fullName: string;
  birthDate: string;
  age: string;
};

export type TechnicalChallenge = {
  challenge: string;
  solution: string;
};

export type CVModel = {
  personalInformation: PersonalInformation;
  overview: Summary;
  contact: ContactInfo;
  skills: Skills;
  projects: Project[];
  education: Education[];
  experience: Experience[];
  languages: Language[];
  certifications: Certificate[];
  referrals: Reference[];
  achievements: Achievement[];
  characteristic: Character;
  technicalChallenges: TechnicalChallenge[];
  workPreferences: {
    remote: string;
    office: string;
    hybrid: string;
  };
};

export interface Character {
  adaptability: string;
  attentionToDetail: string;
  careerGoals: {
    shortTerm: string;
    longTerm: string;
  };
  communicationStyle: string;

  innovation: string;
  leadership: {
    philosophy: string;

    examples: string[];
  };
  motivation: {
    shortTerm: string;

    longTerm: string;
  };

  problemSolvingApproach: string;

  problemSolvingPhilosophy: string;
  resilience: string;
  strengths: string[];
  teamwork: {
    philosophy: string;

    examples: string[];
  };
  weaknesses: string[];
  workEthic: {
    punctuality: string;
    dedication: string;
    continuousLearning: string;
  };
}

export type CVModelKey = keyof CVModel;

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
  | PersonalInformation;

export type MessageWithoutModel = {
  message: string;
};

export type ChatCategory = {
  category: ChatCategoryType;
  keywords: { word: string; weight: number }[];
  model: CVModel[keyof CVModel] | ChatMessage;
};
