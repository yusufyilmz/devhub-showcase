import type { CVModel, Skill } from '../../types'

export const formatters: {
  [K in keyof CVModel]: (data: CVModel[K]) => string
} = {
  personalInformation: (personalInfo) =>
    `Personal Information:\nNationality: ${personalInfo.nationality} \nLocation: ${personalInfo.location} \nFull Name: ${personalInfo.fullName} \nBirth Date: ${personalInfo.birthDate} \nAge: ${personalInfo.age}`,
  contact: (contact) =>
    `Contact Info:\nPhone: ${contact.phone}\nEmail: ${contact.email}\nGitHub: ${contact.github}\nLinkedIn: ${contact.linkedin}`,
  skills: (skills) => {
    if (skills.groups)
      return Object.entries(skills.groups)
        .map(([name, values]) => `${name}: ${values.join(', ')}`)
        .join('\n')
    const formatSkills = (skillSet: Skill[]) =>
      skillSet
        .map((skill) =>
          skill.yearsOfExperience
            ? `${skill.technology}: ${skill.yearsOfExperience} years`
            : skill.technology
        )
        .join('\n')

    return `
  Frontend Skills:
  ${formatSkills(skills.frontend)}
  
  Backend Skills:
  ${formatSkills(skills.backend)}
  
  DevOps Skills:
  ${formatSkills(skills.devops)}
  
  Testing Skills:
  ${formatSkills(skills.testing)}
  
  Version Control:
  ${formatSkills(skills.version_control)}
      `
  },
  projects: (projects) =>
    `Projects:\n${projects
      .map(
        (proj) =>
          `${proj.name} at ${proj.company}\nDescription: ${proj.description}\nSkills Used: ${proj.usedSkills.join(', ')}\n`
      )
      .join('\n')}`,
  education: (education) =>
    `Education:\n${education
      .map(
        (edu) =>
          `${edu.degree} from ${edu.university} (${edu.years})\nGPA: ${edu.gpa}\nDescription: ${edu.description}`
      )
      .join('\n')}`,
  experience: (experience) =>
    `Experience:\n${experience
      .map(
        (exp) =>
          `${exp.position} at ${exp.company} (${exp.years})\n${exp.description}`
      )
      .join('\n')}`,
  languages: (languages) =>
    `Languages:\n${languages
      .map((lang) => `${lang.language} (${lang.proficiency})`)
      .join('\n')}`,
  certifications: (certificates) =>
    `Certificates:\n${certificates
      .map((cert) => `${cert.name} (${cert.date})\nHours: ${cert.hours}`)
      .join('\n')}`,
  referrals: (references) =>
    `References:\n${references
      .map(
        (ref) =>
          `${ref.name} (${ref.position})\nContact: ${ref.contact}\nFeedback: ${ref.feedback}`
      )
      .join('\n')}`,
  achievements: (achievements) =>
    `Achievements:\n${achievements
      .map((ach) => `${ach.title}\nDescription: ${ach.description}`)
      .join('\n')}`,
  characteristic: (characteristic) => `
    Strengths:
    ${characteristic.strengths.join(', ')}
  
    Weaknesses:
    ${characteristic.weaknesses.join(', ')}
  
    Leadership:
    Philosophy: ${characteristic.leadership.philosophy}
    Examples: ${characteristic.leadership.examples.join('; ')}
  
    Teamwork:
    Philosophy: ${characteristic.teamwork.philosophy}
    Examples: ${characteristic.teamwork.examples.join('; ')}
  
    Motivation:
    Short Term: ${characteristic.motivation.shortTerm}
    Long Term: ${characteristic.motivation.longTerm}
  
    Communication Style: ${characteristic.communicationStyle}
    Problem-Solving Philosophy: ${characteristic.problemSolvingPhilosophy}
    Adaptability: ${characteristic.adaptability}
    Innovation: ${characteristic.innovation}
    Problem-Solving Approach: ${characteristic.problemSolvingApproach}
  
    Work Ethic:
    Punctuality: ${characteristic.workEthic.punctuality}
    Dedication: ${characteristic.workEthic.dedication}
    Continuous Learning: ${characteristic.workEthic.continuousLearning}
    
    Resilience: ${characteristic.resilience}
    Attention to Detail: ${characteristic.attentionToDetail}
    Career Goals:
    Short Term: ${characteristic.careerGoals.shortTerm}
    Long Term: ${characteristic.careerGoals.longTerm}
    `,
  workPreferences: (workPreferences) => `
    Remote Work Preference: ${workPreferences.remote}
    Office Work Preference: ${workPreferences.office}
    Hybrid Work Preference: ${workPreferences.hybrid}
    `,
  technicalChallenges: (technicalChallenges) =>
    technicalChallenges
      .map(
        (challenge) =>
          `Challenge: ${challenge.challenge}\nSolution: ${challenge.solution}\n`
      )
      .join('\n'),
  overview: (overview) => `Overview:\n${overview.summary}`
}

export const formatAllCV = (cv: CVModel) => {
  function formatCategory<K extends keyof CVModel>(key: K) {
    return formatters[key](cv[key])
  }
  return (Object.keys(cv) as (keyof CVModel)[])
    .map((key) => formatCategory(key))
    .join('\n\n')
}

export function formatCVCategory<K extends keyof CVModel>(
  key: K,
  data: CVModel[K]
) {
  return formatters[key](data)
}
