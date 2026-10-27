import { profile } from '@shared/content'
import type { CVModel } from '../types/cv'

const skills = (names: string[]) =>
  names.map((technology) => ({ technology, yearsOfExperience: '' }))
const year = (date: string) => date.slice(0, 4)
const month = (date: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(date))
export const CV_MODEL: CVModel = {
  personalInformation: {
    fullName: profile.name,
    location: profile.location,
    birthDate: '',
    age: '',
    nationality: ''
  },
  contact: {
    phone: profile.phone,
    email: profile.email,
    github: profile.github,
    linkedin: profile.linkedin
  },
  overview: { summary: profile.summary },
  skills: {
    frontend: skills(profile.skills.Frontend ?? []),
    backend: skills(profile.skills['Backend & data'] ?? []),
    devops: skills(profile.skills['Platform & quality'] ?? []),
    testing: skills(['Jest', 'React Testing Library', 'Playwright', 'Cypress']),
    version_control: skills(['Git', 'GitHub', 'GitHub Actions']),
    data_visualization: [],
    performance_optimization: skills(['SSR', 'Frontend platform architecture'])
  },
  projects: profile.projects.map((project) => ({
    name: project.name,
    company: project.company,
    description: project.description,
    usedSkills: project.skills
  })),
  experience: profile.experiences.map((item) => ({
    company: item.company,
    position: item.position,
    years: `${month(item.start)} to ${item.end ? month(item.end) : 'Present'}`,
    description: item.achievements.join(' ')
  })),
  education: profile.education.map((item) => ({
    degree: `${item.degree} ${item.field}`,
    university: item.institution,
    years: `${year(item.start)} to ${year(item.end)}`,
    gpa: '',
    description: ''
  })),
  languages: profile.languages,
  certifications: [],
  referrals: [],
  achievements: [
    {
      title: 'Platform engineering',
      description:
        'Built reusable UI primitives, hooks, contexts and tooling across financial applications with type safety and maintainable delivery.'
    },
    {
      title: 'Workflow automation',
      description:
        'Connected interfaces to transaction processing, classification and notification flows, with operational visibility and audit history.'
    },
    {
      title: 'Cross-functional ownership',
      description:
        'Worked with stakeholders to turn ambiguous business flows into reliable interfaces and documented integrations.'
    }
  ],
  characteristic: {
    strengths: [
      'Technical ownership',
      'Cross-functional collaboration',
      'Mentoring',
      'End-to-end product delivery'
    ],
    weaknesses: [],
    leadership: { philosophy: '', examples: [] },
    teamwork: { philosophy: '', examples: [] },
    motivation: { shortTerm: '', longTerm: '' },
    communicationStyle: '',
    problemSolvingPhilosophy: '',
    adaptability: '',
    innovation: '',
    problemSolvingApproach: '',
    workEthic: { punctuality: '', dedication: '', continuousLearning: '' },
    resilience: '',
    attentionToDetail: '',
    careerGoals: { shortTerm: '', longTerm: '' }
  },
  technicalChallenges: [],
  workPreferences: { remote: '', office: '', hybrid: '' }
}
