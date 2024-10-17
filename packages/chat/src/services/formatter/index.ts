import type { CVModel, CVModelKey, CVModelValue, Skill } from '../../types'

export const formatters: {
  [K in keyof CVModel]: (data: CVModel[K]) => string
} = {
  personalInformation: personalInfo =>
    `Personal Information:\nNationality: ${personalInfo.nationality} \nLocation: ${personalInfo.location} \nFull Name: ${personalInfo.fullName} \nBirth Date: ${personalInfo.birthDate} \nAge: ${personalInfo.age}`,
  contact: contact =>
    `Contact Info:\nPhone: ${contact}\nEmail: ${contact.email}\nGitHub: ${contact.github}\nLinkedIn: ${contact.linkedin}`,
  skills: skills => {
    const formatSkills = (skillSet: Skill[]) =>
      skillSet
        .map(skill => `${skill.technology}: ${skill.yearsOfExperience} years`)
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
  projects: projects =>
    `Projects:\n${projects
      .map(
        proj =>
          `${proj.name} at ${proj.company}\nDescription: ${proj.description}\nSkills Used: ${proj.usedSkills.join(', ')}\n`
      )
      .join('\n')}`,
  education: education =>
    `Education:\n${education
      .map(
        edu =>
          `${edu.degree} from ${edu.university} (${edu.years})\nGPA: ${edu.gpa}\nDescription: ${edu.description}`
      )
      .join('\n')}`,
  experience: experience =>
    `Experience:\n${experience
      .map(
        exp =>
          `${exp.position} at ${exp.company} (${exp.years})\n${exp.description}`
      )
      .join('\n')}`,
  languages: languages =>
    `Languages:\n${languages
      .map(lang => `${lang.language} (${lang.proficiency})`)
      .join('\n')}`,
  certifications: certificates =>
    `Certificates:\n${certificates
      .map(cert => `${cert.name} (${cert.date})\nHours: ${cert.hours}`)
      .join('\n')}`,
  references: references =>
    `References:\n${references
      .map(
        ref =>
          `${ref.name} (${ref.position})\nContact: ${ref.contact}\nFeedback: ${ref.feedback}`
      )
      .join('\n')}`,
  achievements: achievements =>
    `Achievements:\n${achievements
      .map(ach => `${ach.title}\nDescription: ${ach.description}`)
      .join('\n')}`,
  character: character => `
    Strengths:
    ${character.strengths.join(', ')}
  
    Weaknesses:
    ${character.weaknesses.join(', ')}
  
    Leadership:
    Philosophy: ${character.leadership.philosophy}
    Examples: ${character.leadership.examples.join('; ')}
  
    Teamwork:
    Philosophy: ${character.teamwork.philosophy}
    Examples: ${character.teamwork.examples.join('; ')}
  
    Motivation:
    Short Term: ${character.motivation.shortTerm}
    Long Term: ${character.motivation.longTerm}
  
    Communication Style: ${character.communicationStyle}
    Problem-Solving Philosophy: ${character.problemSolvingPhilosophy}
    Adaptability: ${character.adaptability}
    Innovation: ${character.innovation}
    Problem-Solving Approach: ${character.problemSolvingApproach}
  
    Work Ethic:
    Punctuality: ${character.workEthic.punctuality}
    Dedication: ${character.workEthic.dedication}
    Continuous Learning: ${character.workEthic.continuousLearning}
    
    Resilience: ${character.resilience}
    Attention to Detail: ${character.attentionToDetail}
    Career Goals:
    Short Term: ${character.careerGoals.shortTerm}
    Long Term: ${character.careerGoals.longTerm}
    `,
  workPreferences: workPreferences => `
    Remote Work Preference: ${workPreferences.remote}
    Office Work Preference: ${workPreferences.office}
    Hybrid Work Preference: ${workPreferences.hybrid}
    `,
  challenges: challenges =>
    challenges
      .map(
        challenge =>
          `Challenge: ${challenge.challenge}\nSolution: ${challenge.solution}\n`
      )
      .join('\n'),
  overview: overview => `Overview:\n${overview.summary}`
}

export const formatAllCV = (cv: CVModel) => {
  return Object.keys(cv)
    .map(key =>
      formatters[key as CVModelKey](cv[key as CVModelKey] as keyof CVModelValue)
    )
    .join('\n\n')
}
