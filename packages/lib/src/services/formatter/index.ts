import {
  CompanyForGptModel,
  EducationForGptModel,
  ProjectForGptModel,
  ReferralForGptModel
} from '../../types'
import { ExperienceForGptModel } from '../../types/experience'

export const educationFormatter = (
  educations: EducationForGptModel[]
): string => {
  return educations
    .map(
      edu =>
        `Education: ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.institutionLink}), 
      ${edu.startedAt} - ${edu.finishedAt || 'present'}` +
        (edu.gpa ? `, GPA: ${edu.gpa}` : '') +
        (edu.description ? `, Description: ${edu.description}` : '')
    )
    .join('\n')
}

export const referralFormatter = (referrals: ReferralForGptModel[]): string => {
  return referrals
    .map(
      referral =>
        `Referral: ${referral.name || 'Unknown'}, Relationship: ${referral.relationship || 'N/A'}, 
      Feedback: ${referral.feedback || 'No feedback'}, 
      Recommendation: ${referral.recommendation || 'No recommendation'}, 
      Contact: ${referral.contactInfo || 'No contact info'}`
    )
    .join('\n')
}

export const experienceFormatter = (
  experiences: ExperienceForGptModel[]
): string => {
  return experiences
    .map(
      exp =>
        `Experience: ${exp.role} at ${exp.company?.name}, from ${exp.startedAt} to ${exp.finishedAt || 'present'}`
    )
    .join('\n')
}

export const projectFormatter = (projects: ProjectForGptModel[]): string => {
  return projects
    .map(
      project =>
        `Project: ${project.title}, Role: ${project.role}, Skills: ${project.skills.map(skill => skill.name).join(', ')}`
    )
    .join('\n')
}

export const companyFormatter = (companies: CompanyForGptModel[]): string => {
  return companies
    .map(company => `Company: ${company.name}, Link: ${company.link}`)
    .join('\n')
}
