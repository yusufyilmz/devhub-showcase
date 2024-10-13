import { CVCategory, QuestionCategory } from '../types/cv'
import { CV_MODEL } from './cv-model'
import { copy } from '@shared/content'

export const QUESTION_CATEGORIES: Record<CVCategory, QuestionCategory> = {
  [CVCategory.Skills]: {
    category: CVCategory.Skills,
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
  [CVCategory.Experience]: {
    category: CVCategory.Experience,
    weight: 1,
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
  [CVCategory.Projects]: {
    category: CVCategory.Projects,
    weight: 1,

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
  [CVCategory.Education]: {
    category: CVCategory.Education,
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
  [CVCategory.ContactInformation]: {
    category: CVCategory.ContactInformation,
    weight: 1,
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
  [CVCategory.Greetings]: {
    category: CVCategory.Greetings,
    weight: 1,
    model: copy.chatMessages.greetingMessage,
    keywords: [
      { word: 'hello', weight: 3 },
      { word: 'hi', weight: 2 },
      { word: 'hey', weight: 2 },
      { word: 'greetings', weight: 3 },
      { word: 'good morning', weight: 2 },
      { word: 'good evening', weight: 2 },
      { word: "what's up", weight: 3 },
      { word: 'bye', weight: 2 },
      { word: 'goodbye', weight: 3 },
      { word: 'see you', weight: 2 },
      { word: 'talk later', weight: 2 }
    ]
  },
  [CVCategory.OutOfTopic]: {
    category: CVCategory.OutOfTopic,
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
  [CVCategory.Languages]: {
    category: CVCategory.Languages,
    weight: 1,
    model: CV_MODEL.languages,
    keywords: [
      {
        word: 'languages',
        weight: 2
      },
      {
        word: 'proficiency',
        weight: 3
      },
      {
        word: 'spoken',
        weight: 2
      },
      {
        word: 'written',
        weight: 2
      },
      {
        word: 'fluency',
        weight: 3
      },
      {
        word: 'communication',
        weight: 2
      },
      {
        word: 'skills',
        weight: 2
      },
      {
        word: 'multilingual',
        weight: 3
      },
      {
        word: 'foreign',
        weight: 2
      },
      {
        word: 'language',
        weight: 2
      },
      {
        word: 'proficient',
        weight: 3
      },
      {
        word: 'bilingual',
        weight: 2
      },
      {
        word: 'native',
        weight: 2
      },
      {
        word: 'second',
        weight: 3
      },
      {
        word: 'mother tongue',
        weight: 2
      },
      {
        word: 'fluent',
        weight: 2
      },
      {
        word: 'speak',
        weight: 3
      },
      {
        word: 'English',
        weight: 5
      },
      {
        word: 'Spanish',
        weight: 5
      },
      {
        word: 'Turkish',
        weight: 5
      }
    ]
  },
  [CVCategory.References]: {
    category: CVCategory.References,
    model: CV_MODEL.references,
    keywords: [
      {
        word: 'references',
        weight: 2
      },
      {
        word: 'recommendations',
        weight: 3
      },
      {
        word: 'colleagues',
        weight: 2
      },
      {
        word: 'clients',
        weight: 2
      },
      {
        word: 'supervisors',
        weight: 3
      }
    ]
  },
  [CVCategory.Unknown]: {
    category: CVCategory.Unknown,
    model: copy.chatMessages.unknownMessage,
    keywords: []
  },
  [CVCategory.Certificates]: {
    category: CVCategory.Certificates,
    model: CV_MODEL.certificates,
    keywords: [
      {
        word: 'certificates',
        weight: 2
      },
      {
        word: 'certifications',
        weight: 3
      },
      {
        word: 'awards',
        weight: 2
      },
      {
        word: 'courses',
        weight: 2
      },
      {
        word: 'training',
        weight: 3
      }
    ]
  },
  [CVCategory.Achievement]: {
    category: CVCategory.Achievement,
    model: CV_MODEL.achievements,
    keywords: [
      {
        word: 'achievements',
        weight: 2
      },
      {
        word: 'accomplishments',
        weight: 3
      },
      {
        word: 'successes',
        weight: 2
      },
      {
        word: 'milestones',
        weight: 2
      },
      {
        word: 'goals',
        weight: 3
      }
    ]
  }
}

// type CVCategory = 'Skills' | 'Experience' | 'Projects' | 'Education' | 'Contact Information' | 'Unknown';

// Define question categories with keywords and weights

// "commonQuestions": [
//   {
//     "question": "What are your key skills?",
//     "answer": "My key skills include React, Next.js, Node.js, TypeScript, PostgreSQL, Prisma, Docker, and CI/CD tools like GitHub Actions."
//   },
//   {
//     "question": "Can you describe a project you've worked on?",
//     "answer": "I developed the TAG/Assets Generator for Toptal, automating success story creation using AI. It saved countless hours by creating personalized stories and allowing users to easily modify and publish them."
//   },
//   {
//     "question": "What was your role at Toptal?",
//     "answer": "As a Senior Frontend Engineer, I led several projects, including the migration of legacy tools to Next.js, the development of Google Ads utilities, and the creation of the TAG/Assets Generator."
//   },
//   {
//     "question": "What are your interests outside of work?",
//     "answer": "I'm particularly interested in AI, automation, and improving web performance. I also enjoy exploring UI/UX design trends."
//   },
//   {
//     "question": "How do you handle large-scale projects?",
//     "answer": "I prioritize modular architecture and scalable technologies. By using microservices and tools like Docker and Kubernetes, I ensure projects can grow without sacrificing performance."
//   },
//   {
//     "question": "What is your approach to managing time and priorities?",
//     "answer": "I utilize Agile methodologies like Scrum and Kanban to manage time and priorities effectively. Breaking down tasks into smaller, manageable units and maintaining clear communication with stakeholders ensures successful project delivery."
//   },
//   {
//     "question": "How do you stay updated with the latest technology trends?",
//     "answer": "I regularly follow tech blogs, attend webinars, and complete courses to stay up to date. I also actively contribute to projects that implement cutting-edge technologies."
//   },
//   {
//     "question": "What technologies are you most excited about?",
//     "answer": "I'm excited about AI/ML, serverless architecture, and microservices. Technologies like Dify.AI, server-side rendering, and containerization with Docker and Kubernetes also excite me because of their impact on scalability and performance."
//   },
//   {
//     "question": "Can you describe a challenge you faced during a project?",
//     "answer": "In one of my projects at Toptal, migrating legacy systems to modern technologies like Next.js while maintaining existing functionality was a challenge. We overcame it by using an iterative migration approach, ensuring minimal downtime and a seamless transition."
//   },
//   {
//     "question": "What motivates you as a software engineer?",
//     "answer": "I am motivated by solving complex problems, improving system performance, and seeing the positive impact of my work on users. The opportunity to innovate and work with cutting-edge technologies also keeps me motivated."
//   },
//   {
//     "question": "What is your approach to mentoring junior developers?",
//     "answer": "I focus on providing clear guidance, sharing my knowledge, and offering hands-on assistance when needed. I encourage juniors to solve problems independently while providing support and helping them improve their coding and problem-solving skills."
//   },
//   {
//     "question": "What are your long-term career goals?",
//     "answer": "I aim to continue evolving as a full-stack developer while taking on more leadership responsibilities, mentoring others, and contributing to impactful, large-scale projects. I'm also interested in deepening my expertise in AI and machine learning technologies."
//   },
//   {
//     "question": "How do you ensure code quality in your projects?",
//     "answer": "I maintain code quality through automated testing (unit and integration tests), code reviews, and following industry best practices like DRY and SOLID principles. I also use CI/CD pipelines to ensure smooth code deployment."
//   },
//   {
//     "question": "Can you describe your experience working with cloud platforms?",
//     "answer": "I have extensive experience with AWS, particularly with services like Lambda and S3. I also have worked on deploying microservices using Kubernetes and Docker, optimizing for scalability and performance."
//   },
//   {
//     "question": "What do you enjoy the most about software development?",
//     "answer": "I enjoy the problem-solving aspect of software development and the ability to create solutions that have a real-world impact. I also enjoy learning new technologies and applying them to enhance the performance and scalability of applications."
//   }
