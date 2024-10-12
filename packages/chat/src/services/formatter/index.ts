import type { CVModel, CVModelKey, CVModelValue, Skill } from '../../types'

export const formatters: {
  [K in keyof CVModel]: (data: CVModel[K]) => string
} = {
  name: name => `Name: ${name}`,
  nationality: nationality => `Nationality: ${nationality}`,
  location: location => `Location: ${location}`,
  contact: contact =>
    `Contact Info:\nPhone: ${contact}\nEmail: ${contact.email}\nGitHub: ${contact.github}\nLinkedIn: ${contact.linkedin}`,
  summary: summary => `Summary: ${summary}`,
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
  certificates: certificates =>
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
      .join('\n')}`
}

export const formatAllCV = (cv: CVModel) => {
  return Object.keys(cv)
    .map(key =>
      formatters[key as CVModelKey](cv[key as CVModelKey] as keyof CVModelValue)
    )
    .join('\n\n')
}
