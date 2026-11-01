import type { ChatCategoryType } from "@shared/lib/types";

import {
  goodbyeMessage,
  greetingMessage,
  notMeaningfulMessage,
  outOfTopicMessage,
  processErrorMessage,
  simpleResponseMessage,
  unknownMessage,
} from "../messages";
import type { ChatCategory, CVModel } from "../types/cv";

export function createQuestionCategories(
  CV_MODEL: CVModel,
): Record<ChatCategoryType, ChatCategory> {
  return {
    achievements: {
      category: "achievements",
      keywords: [
        { weight: 2, word: "achievements" },
        { weight: 3, word: "accomplishments" },
        { weight: 2, word: "successes" },
        { weight: 2, word: "milestones" },
        { weight: 3, word: "goals" },
      ],
      model: CV_MODEL.achievements,
    },
    certifications: {
      category: "certifications",
      keywords: [
        { weight: 2, word: "certificates" },
        { weight: 3, word: "certifications" },
        { weight: 2, word: "awards" },
        { weight: 2, word: "courses" },
        { weight: 3, word: "training" },
      ],
      model: CV_MODEL.certifications,
    },
    characteristic: {
      category: "characteristic",
      keywords: [
        {
          weight: 3,
          word: "characteristic",
        },
        {
          weight: 2,
          word: "traits",
        },
        {
          weight: 2,
          word: "personality",
        },
        {
          weight: 3,
          word: "strengths",
        },
        {
          weight: 2,
          word: "weaknesses",
        },
        {
          weight: 3,
          word: "leadership",
        },
        {
          weight: 2,
          word: "teamwork",
        },
        {
          weight: 2,
          word: "motivation",
        },
        {
          weight: 3,
          word: "communication",
        },
      ],
      model: CV_MODEL.characteristic,
    },
    contact: {
      category: "contact",
      keywords: [
        { weight: 3, word: "contact" },
        { weight: 3, word: "phone" },
        { weight: 2, word: "email" },
        { weight: 2, word: "linkedin" },
        { weight: 3, word: "reach" },
        { weight: 2, word: "connect" },
        { weight: 2, word: "social media" },
        { weight: 3, word: "profile" },
        { weight: 2, word: "find" },
        { weight: 2, word: "address" },
        { weight: 2, word: "location" },
        { weight: 3, word: "details" },
        { weight: 3, word: "communicate" },
        { weight: 2, word: "talk" },
      ],
      model: CV_MODEL.contact,
    },
    education: {
      category: "education",
      keywords: [
        { weight: 3, word: "education" },
        { weight: 3, word: "degree" },
        { weight: 2, word: "study" },
        { weight: 2, word: "university" },
        { weight: 2, word: "course" },
        { weight: 2, word: "certification" },
        { weight: 3, word: "training" },
        { weight: 2, word: "qualification" },
        { weight: 2, word: "learning" },
        { weight: 3, word: "academic" },
        { weight: 2, word: "background" },
        { weight: 1, word: "skills" },
        { weight: 2, word: "competence" },
        { weight: 3, word: "professor" },
        { weight: 2, word: "curriculum" },
        { weight: 2, word: "institution" },
        { weight: 3, word: "graduation" },
        { weight: 2, word: "program" },
        ...CV_MODEL.education
          .map((education) => education.university)
          .concat(CV_MODEL.education.map((education) => education.degree))
          .map((word) => ({ weight: 1, word })),
      ],
      model: CV_MODEL.education,
    },
    end: {
      category: "end",
      keywords: [
        {
          weight: 3,
          word: "goodbye",
        },
        {
          weight: 3,
          word: "bye",
        },
        {
          weight: 3,
          word: "see you",
        },
        {
          weight: 3,
          word: "talk later",
        },
      ],
      model: goodbyeMessage,
    },
    error: {
      category: "error",
      keywords: [],
      model: processErrorMessage,
    },
    experience: {
      category: "experience",
      keywords: [
        { weight: 3, word: "experience" },
        { weight: 3, word: "career" },
        { weight: 2, word: "work" },
        { weight: 2, word: "role" },
        { weight: 3, word: "job" },
        { weight: 3, word: "background" },
        { weight: 2, word: "positions" },
        { weight: 2, word: "employment" },
        { weight: 3, word: "jobs" },
        { weight: 2, word: "industry" },
        { weight: 2, word: "field" },
        { weight: 3, word: "years" },
        { weight: 3, word: "specialization" },
        { weight: 2, word: "responsibilities" },
        { weight: 2, word: "tasks" },
        { weight: 3, word: "challenges" },
        { weight: 2, word: "projects" },
        { weight: 2, word: "assignments" },
        { weight: 3, word: "achievements" },
        { weight: 2, word: "contributions" },
        ...CV_MODEL.experience
          .map((exp) => exp.company)
          .concat(CV_MODEL.experience.map((exp) => exp.position))
          .map((word) => ({ weight: 1, word })),
      ],
      model: CV_MODEL.experience,
    },
    greeting: {
      category: "greeting",
      keywords: [
        { weight: 3, word: "hello" },
        { weight: 2, word: "hi" },
        { weight: 2, word: "hey" },
        { weight: 3, word: "greetings" },
        { weight: 2, word: "good morning" },
        { weight: 2, word: "good evening" },
        { weight: 3, word: "what's up" },
      ],
      model: greetingMessage,
    },
    languages: {
      category: "languages",
      keywords: [
        { weight: 2, word: "languages" },
        { weight: 3, word: "proficiency" },
        { weight: 2, word: "spoken" },
        { weight: 2, word: "written" },
        { weight: 3, word: "fluency" },
        { weight: 2, word: "communication" },
        { weight: 3, word: "multilingual" },
        { weight: 2, word: "foreign" },
        { weight: 2, word: "language" },
        { weight: 3, word: "proficient" },
        { weight: 2, word: "bilingual" },
        { weight: 2, word: "native" },
        { weight: 2, word: "mother tongue" },
        { weight: 2, word: "fluent" },
        { weight: 3, word: "speak" },
        { weight: 5, word: "English" },
        { weight: 5, word: "Spanish" },
        { weight: 5, word: "Turkish" },
      ],
      model: CV_MODEL.languages,
    },
    notMeaningful: {
      category: "notMeaningful",
      keywords: [],
      model: notMeaningfulMessage,
    },
    outOfTopic: {
      category: "outOfTopic",
      keywords: [
        { weight: 5, word: "weather" },
        { weight: 5, word: "random" },
        { weight: 5, word: "joke" },
        { weight: 5, word: "fun" },
        { weight: 5, word: "hobby" },
        { weight: 5, word: "movie" },
        { weight: 5, word: "food" },
      ],
      model: outOfTopicMessage,
    },
    overview: {
      category: "overview",
      keywords: [
        {
          weight: 3,
          word: "overview",
        },
        {
          weight: 2,
          word: "introduction",
        },
        {
          weight: 3,
          word: "about",
        },
        {
          weight: 3,
          word: "background",
        },
        {
          weight: 2,
          word: "profile",
        },
        {
          weight: 2,
          word: "summary",
        },
      ],
      model: CV_MODEL.overview,
    },
    personalInformation: {
      category: "personalInformation",
      keywords: [
        { weight: 3, word: "personal information" },
        { weight: 3, word: "about me" },
        { weight: 2, word: "myself" },
        { weight: 3, word: "background" },
        { weight: 2, word: "profile" },
        { weight: 2, word: "summary" },
        { weight: 2, word: "overview" },
        { weight: 3, word: "characteristic" },
        { weight: 2, word: "traits" },
        { weight: 2, word: "personality" },
        { weight: 3, word: "skills" },
        { weight: 2, word: "preferrals" },
        { weight: 2, word: "work" },
        { weight: 3, word: "challenges" },
        { weight: 2, word: "technical" },
        { weight: 2, word: "work" },
        { weight: 2, word: "preferrals" },
      ],
      model: CV_MODEL.personalInformation,
    },
    projects: {
      category: "projects",
      keywords: [
        { weight: 3, word: "projects" },
        { weight: 3, word: "initiatives" },
        { weight: 2, word: "work on" },
        { weight: 2, word: "applications" },
        { weight: 3, word: "tools" },
        { weight: 2, word: "software" },
        { weight: 2, word: "developed" },
        { weight: 3, word: "built" },
        { weight: 2, word: "products" },
        { weight: 3, word: "solutions" },
        { weight: 2, word: "implementations" },
        { weight: 3, word: "services" },
        { weight: 2, word: "platforms" },
        { weight: 2, word: "design" },
        { weight: 3, word: "deployment" },
        { weight: 2, word: "integration" },
        { weight: 2, word: "automation" },
        { weight: 3, word: "optimization" },
        { weight: 2, word: "processes" },
        ...CV_MODEL.projects.map((project) => project.name).map((word) => ({ weight: 1, word })),
      ],
      model: CV_MODEL.projects,
    },
    referrals: {
      category: "referrals",
      keywords: [
        { weight: 2, word: "referrals" },
        { weight: 3, word: "recommendations" },
        { weight: 2, word: "colleagues" },
        { weight: 2, word: "clients" },
        { weight: 3, word: "supervisors" },
      ],
      model: CV_MODEL.referrals,
    },
    simpleResponse: {
      category: "simpleResponse",
      keywords: [
        {
          weight: 1,
          word: "yes",
        },
        {
          weight: 1,
          word: "no",
        },
        {
          weight: 1,
          word: "ok",
        },
        {
          weight: 1,
          word: "maybe",
        },
        {
          weight: 1,
          word: "sure",
        },
        {
          weight: 1,
          word: "of course",
        },
        {
          weight: 1,
          word: "absolutely",
        },
        {
          weight: 1,
          word: "definitely",
        },
        {
          weight: 1,
          word: "not really",
        },
        {
          weight: 1,
          word: "not sure",
        },
        {
          weight: 1,
          word: "not really",
        },
        {
          weight: 1,
          word: "not at all",
        },
        {
          weight: 1,
          word: "not exactly",
        },
      ],
      model: simpleResponseMessage,
    },
    skills: {
      category: "skills",
      keywords: [
        { weight: 3, word: "skills" },
        { weight: 3, word: "expertise" },
        { weight: 2, word: "technologies" },
        { weight: 2, word: "stack" },
        { weight: 2, word: "tools" },
        { weight: 3, word: "frameworks" },
        { weight: 2, word: "frontend" },
        { weight: 2, word: "backend" },
        { weight: 3, word: "programming" },
        { weight: 2, word: "languages" },
        { weight: 2, word: "libraries" },
        { weight: 3, word: "development" },
        { weight: 2, word: "coding" },
        { weight: 2, word: "technical" },
        { weight: 3, word: "proficiency" },
        { weight: 2, word: "abilities" },
        { weight: 2, word: "techniques" },
        { weight: 3, word: "methodologies" },
        { weight: 2, word: "toolset" },
        ...CV_MODEL.skills.frontend
          .map((skill) => skill.technology)
          .concat(CV_MODEL.skills.backend.map((skill) => skill.technology))
          .concat(CV_MODEL.skills.devops.map((skill) => skill.technology))
          .concat(CV_MODEL.skills.testing.map((skill) => skill.technology))
          .concat(CV_MODEL.skills.version_control.map((skill) => skill.technology))
          .concat(CV_MODEL.skills.data_visualization.map((skill) => skill.technology))
          .concat(CV_MODEL.skills.performance_optimization.map((skill) => skill.technology))
          .map((word) => ({ weight: 3, word })),
      ],
      model: CV_MODEL.skills,
    },
    technicalChallenges: {
      category: "personalInformation",
      keywords: [
        {
          weight: 3,
          word: "technical",
        },
        {
          weight: 2,
          word: "challenges",
        },
        {
          weight: 2,
          word: "problems",
        },
        {
          weight: 3,
          word: "solutions",
        },
        {
          weight: 2,
          word: "issues",
        },
        {
          weight: 2,
          word: "troubleshooting",
        },
        {
          weight: 2,
          word: "debugging",
        },
        {
          weight: 2,
          word: "fixing",
        },
        {
          weight: 2,
          word: "errors",
        },
        {
          weight: 2,
          word: "bugs",
        },
        {
          weight: 2,
          word: "improvements",
        },
        {
          weight: 2,
          word: "optimization",
        },
        {
          weight: 2,
          word: "performance",
        },
        {
          weight: 2,
          word: "scalability",
        },
        {
          weight: 2,
          word: "security",
        },
        {
          weight: 2,
          word: "best practices",
        },
      ],
      model: CV_MODEL.technicalChallenges,
    },
    unknown: {
      category: "unknown",
      keywords: [],
      model: unknownMessage,
    },
    workPreferences: {
      category: "workPreferences",
      keywords: [
        {
          weight: 3,
          word: "work",
        },
        {
          weight: 2,
          word: "preferrals",
        },
        {
          weight: 3,
          word: "remote",
        },
        {
          weight: 3,
          word: "office",
        },
        {
          weight: 3,
          word: "hybrid",
        },
      ],
      model: CV_MODEL.workPreferences,
    },
  };
}
