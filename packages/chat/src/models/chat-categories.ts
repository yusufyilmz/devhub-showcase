import { ChatCategoryType } from '@shared/lib/types'
import { ChatCategory } from '../types/cv'
import { CV_MODEL } from './cv-model'
import { copy } from '@shared/content'

export const CHAT_CATEGORIES: Record<ChatCategoryType, ChatCategory> = {
  skills: {
    category: 'skills',
    model: CV_MODEL.skills,
    keywords: [
      { word: 'skills', weight: 3 },
      { word: 'expertise', weight: 3 },
      { word: 'technologies', weight: 2 },
      { word: 'stack', weight: 2 },
      { word: 'tools', weight: 2 },
      { word: 'frameworks', weight: 3 },
      { word: 'frontend', weight: 2 },
      { word: 'backend', weight: 2 },
      { word: 'programming', weight: 3 },
      { word: 'languages', weight: 2 },
      { word: 'libraries', weight: 2 },
      { word: 'development', weight: 3 },
      { word: 'coding', weight: 2 },
      { word: 'technical', weight: 2 },
      { word: 'proficiency', weight: 3 },
      { word: 'abilities', weight: 2 },
      { word: 'techniques', weight: 2 },
      { word: 'methodologies', weight: 3 },
      { word: 'toolset', weight: 2 },
      ...CV_MODEL.skills.frontend
        .map(skill => skill.technology)
        .concat(CV_MODEL.skills.backend.map(skill => skill.technology))
        .concat(CV_MODEL.skills.devops.map(skill => skill.technology))
        .concat(CV_MODEL.skills.testing.map(skill => skill.technology))
        .concat(CV_MODEL.skills.version_control.map(skill => skill.technology))
        .concat(
          CV_MODEL.skills.data_visualization.map(skill => skill.technology)
        )
        .concat(
          CV_MODEL.skills.performance_optimization.map(
            skill => skill.technology
          )
        )
        .map(word => ({ word, weight: 3 }))
    ]
  },
  experience: {
    category: 'experience',
    model: CV_MODEL.experience,
    keywords: [
      { word: 'experience', weight: 3 },
      { word: 'career', weight: 3 },
      { word: 'work', weight: 2 },
      { word: 'role', weight: 2 },
      { word: 'background', weight: 3 },
      { word: 'positions', weight: 2 },
      { word: 'employment', weight: 2 },
      { word: 'jobs', weight: 3 },
      { word: 'industry', weight: 2 },
      { word: 'field', weight: 2 },
      { word: 'years', weight: 3 },
      { word: 'specialization', weight: 3 },
      { word: 'responsibilities', weight: 2 },
      { word: 'tasks', weight: 2 },
      { word: 'challenges', weight: 3 },
      { word: 'projects', weight: 2 },
      { word: 'assignments', weight: 2 },
      { word: 'achievements', weight: 3 },
      { word: 'contributions', weight: 2 },
      ...CV_MODEL.experience
        .map(exp => exp.company)
        .concat(CV_MODEL.experience.map(exp => exp.position))
        .map(word => ({ word, weight: 1 }))
    ]
  },
  projects: {
    category: 'projects',
    model: CV_MODEL.projects,
    keywords: [
      { word: 'projects', weight: 3 },
      { word: 'initiatives', weight: 3 },
      { word: 'work on', weight: 2 },
      { word: 'applications', weight: 2 },
      { word: 'tools', weight: 3 },
      { word: 'software', weight: 2 },
      { word: 'developed', weight: 2 },
      { word: 'built', weight: 3 },
      { word: 'products', weight: 2 },
      { word: 'solutions', weight: 3 },
      { word: 'implementations', weight: 2 },
      { word: 'services', weight: 3 },
      { word: 'platforms', weight: 2 },
      { word: 'design', weight: 2 },
      { word: 'deployment', weight: 3 },
      { word: 'integration', weight: 2 },
      { word: 'automation', weight: 2 },
      { word: 'optimization', weight: 3 },
      { word: 'processes', weight: 2 },
      ...CV_MODEL.projects
        .map(project => project.name)
        .map(word => ({ word, weight: 1 }))
    ]
  },
  education: {
    category: 'education',
    model: CV_MODEL.education,
    keywords: [
      { word: 'education', weight: 3 },
      { word: 'degree', weight: 3 },
      { word: 'study', weight: 2 },
      { word: 'university', weight: 2 },
      { word: 'course', weight: 2 },
      { word: 'certification', weight: 2 },
      { word: 'training', weight: 3 },
      { word: 'qualification', weight: 2 },
      { word: 'learning', weight: 2 },
      { word: 'academic', weight: 3 },
      { word: 'background', weight: 2 },
      { word: 'skills', weight: 1 },
      { word: 'competence', weight: 2 },
      { word: 'professor', weight: 3 },
      { word: 'curriculum', weight: 2 },
      { word: 'institution', weight: 2 },
      { word: 'graduation', weight: 3 },
      { word: 'program', weight: 2 },
      ...CV_MODEL.education
        .map(education => education.university)
        .concat(CV_MODEL.education.map(education => education.degree))
        .map(word => ({ word, weight: 1 }))
    ]
  },
  contact: {
    category: 'contact',
    model: CV_MODEL.contact,
    keywords: [
      { word: 'contact', weight: 3 },
      { word: 'phone', weight: 3 },
      { word: 'email', weight: 2 },
      { word: 'linkedin', weight: 2 },
      { word: 'reach', weight: 3 },
      { word: 'connect', weight: 2 },
      { word: 'social media', weight: 2 },
      { word: 'profile', weight: 3 },
      { word: 'find', weight: 2 },
      { word: 'address', weight: 2 },
      { word: 'location', weight: 2 },
      { word: 'details', weight: 3 },
      { word: 'communicate', weight: 3 },
      { word: 'talk', weight: 2 }
    ]
  },
  greeting: {
    category: 'greeting',
    model: copy.chatMessages.greetingMessage,
    keywords: [
      { word: 'hello', weight: 3 },
      { word: 'hi', weight: 2 },
      { word: 'hey', weight: 2 },
      { word: 'greetings', weight: 3 },
      { word: 'good morning', weight: 2 },
      { word: 'good evening', weight: 2 },
      { word: "what's up", weight: 3 }
    ]
  },
  outOfTopic: {
    category: 'outOfTopic',
    keywords: [
      { word: 'weather', weight: 5 },
      { word: 'random', weight: 5 },
      { word: 'joke', weight: 5 },
      { word: 'fun', weight: 5 },
      { word: 'hobby', weight: 5 },
      { word: 'movie', weight: 5 },
      { word: 'food', weight: 5 },
      { word: 'favorite', weight: 5 }
    ],
    model: copy.chatMessages.outOfTopicMessage
  },
  languages: {
    category: 'languages',
    model: CV_MODEL.languages,
    keywords: [
      { word: 'languages', weight: 2 },
      { word: 'proficiency', weight: 3 },
      { word: 'spoken', weight: 2 },
      { word: 'written', weight: 2 },
      { word: 'fluency', weight: 3 },
      { word: 'communication', weight: 2 },
      { word: 'multilingual', weight: 3 },
      { word: 'foreign', weight: 2 },
      { word: 'language', weight: 2 },
      { word: 'proficient', weight: 3 },
      { word: 'bilingual', weight: 2 },
      { word: 'native', weight: 2 },
      { word: 'mother tongue', weight: 2 },
      { word: 'fluent', weight: 2 },
      { word: 'speak', weight: 3 },
      { word: 'English', weight: 5 },
      { word: 'Spanish', weight: 5 },
      { word: 'Turkish', weight: 5 }
    ]
  },
  referrals: {
    category: 'referrals',
    model: CV_MODEL.references,
    keywords: [
      { word: 'references', weight: 2 },
      { word: 'recommendations', weight: 3 },
      { word: 'colleagues', weight: 2 },
      { word: 'clients', weight: 2 },
      { word: 'supervisors', weight: 3 }
    ]
  },
  unknown: {
    category: 'unknown',
    model: copy.chatMessages.unknownMessage,
    keywords: []
  },
  certifications: {
    category: 'certifications',
    model: CV_MODEL.certifications,
    keywords: [
      { word: 'certificates', weight: 2 },
      { word: 'certifications', weight: 3 },
      { word: 'awards', weight: 2 },
      { word: 'courses', weight: 2 },
      { word: 'training', weight: 3 }
    ]
  },
  achievements: {
    category: 'achievements',
    model: CV_MODEL.achievements,
    keywords: [
      { word: 'achievements', weight: 2 },
      { word: 'accomplishments', weight: 3 },
      { word: 'successes', weight: 2 },
      { word: 'milestones', weight: 2 },
      { word: 'goals', weight: 3 }
    ]
  },
  personalInformation: {
    category: 'personalInformation',
    model: CV_MODEL.personalInformation,
    keywords: [
      { word: 'personal information', weight: 3 },
      { word: 'about me', weight: 3 },
      { word: 'myself', weight: 2 },
      { word: 'background', weight: 3 },
      { word: 'profile', weight: 2 },
      { word: 'summary', weight: 2 },
      { word: 'overview', weight: 2 },
      { word: 'character', weight: 3 },
      { word: 'traits', weight: 2 },
      { word: 'personality', weight: 2 },
      { word: 'skills', weight: 3 },
      { word: 'preferences', weight: 2 },
      { word: 'work', weight: 2 },
      { word: 'challenges', weight: 3 },
      { word: 'technical', weight: 2 },
      { word: 'work', weight: 2 },
      { word: 'preferences', weight: 2 }
    ]
  },
  overview: {
    category: 'overview',
    model: CV_MODEL.overview,
    keywords: [
      {
        word: 'overview',
        weight: 3
      },
      {
        word: 'introduction',
        weight: 2
      },
      {
        word: 'background',
        weight: 3
      },
      {
        word: 'profile',
        weight: 2
      },
      {
        word: 'summary',
        weight: 2
      }
    ]
  },
  characteristic: {
    category: 'characteristic',
    model: CV_MODEL.character,
    keywords: [
      {
        word: 'character',
        weight: 3
      },
      {
        word: 'traits',
        weight: 2
      },
      {
        word: 'personality',
        weight: 2
      },
      {
        word: 'strengths',
        weight: 3
      },
      {
        word: 'weaknesses',
        weight: 2
      },
      {
        word: 'leadership',
        weight: 3
      },
      {
        word: 'teamwork',
        weight: 2
      },
      {
        word: 'motivation',
        weight: 2
      },
      {
        word: 'communication',
        weight: 3
      }
    ]
  },
  challenges: {
    model: CV_MODEL.challenges,
    category: 'personalInformation',
    keywords: [
      {
        word: 'technical',
        weight: 3
      },
      {
        word: 'challenges',
        weight: 2
      },
      {
        word: 'problems',
        weight: 2
      },
      {
        word: 'solutions',
        weight: 3
      },
      {
        word: 'issues',
        weight: 2
      },
      {
        word: 'troubleshooting',
        weight: 2
      },
      {
        word: 'debugging',
        weight: 2
      },
      {
        word: 'fixing',
        weight: 2
      },
      {
        word: 'errors',
        weight: 2
      },
      {
        word: 'bugs',
        weight: 2
      },
      {
        word: 'improvements',
        weight: 2
      },
      {
        word: 'optimization',
        weight: 2
      },
      {
        word: 'performance',
        weight: 2
      },
      {
        word: 'scalability',
        weight: 2
      },
      {
        word: 'security',
        weight: 2
      },
      {
        word: 'best practices',
        weight: 2
      }
    ]
  },
  workPreferences: {
    category: 'workPreferences',
    model: CV_MODEL.workPreferences,
    keywords: [
      {
        word: 'work',
        weight: 3
      },
      {
        word: 'preferences',
        weight: 2
      },
      {
        word: 'remote',
        weight: 3
      },
      {
        word: 'office',
        weight: 3
      },
      {
        word: 'hybrid',
        weight: 3
      }
    ]
  },
  simpleResponse: {
    category: 'simpleResponse',
    keywords: [
      {
        word: 'yes',
        weight: 1
      },
      {
        word: 'no',
        weight: 1
      },
      {
        word: 'ok',
        weight: 1
      },
      {
        word: 'maybe',
        weight: 1
      },
      {
        word: 'sure',
        weight: 1
      },
      {
        word: 'of course',
        weight: 1
      },
      {
        word: 'absolutely',
        weight: 1
      },
      {
        word: 'definitely',
        weight: 1
      },
      {
        word: 'not really',
        weight: 1
      },
      {
        word: 'not sure',
        weight: 1
      },
      {
        word: 'not really',
        weight: 1
      },
      {
        word: 'not at all',
        weight: 1
      },
      {
        word: 'not exactly',
        weight: 1
      }
    ],
    model: copy.chatMessages.simpleResponseMessage
  },
  end: {
    category: 'end',
    keywords: [
      {
        word: 'goodbye',
        weight: 3
      },
      {
        word: 'bye',
        weight: 3
      },
      {
        word: 'see you',
        weight: 3
      },
      {
        word: 'talk later',
        weight: 3
      }
    ],
    model: copy.chatMessages.goodbyeMessage
  },
  error: {
    category: 'error',
    keywords: [],
    model: copy.chatMessages.processErrorMessage
  },
  notMeaningful: {
    category: 'notMeaningful',
    keywords: [],
    model: copy.chatMessages.notMeaningfulMessage
  }
}
