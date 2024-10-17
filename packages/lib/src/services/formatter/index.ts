import {
  CompanyForCvModel,
  EducationForCvModel,
  LanguageForCvModel,
  ProjectForCvModel,
  ReferralForCvModel
} from '../../types'
import { AchievementForCvModel } from '../../types/achievement'
import { CertificationForCvModel } from '../../types/certification'
import { ChallengeForCvModel } from '../../types/challenge'
import { CharacteristicForCvModel } from '../../types/characteristic'
import { ExperienceForCvModel } from '../../types/experience'
import { SkillForCvModel } from '../../types/skill'

export const educationFormatter = (
  educations: EducationForCvModel[]
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

export const referralFormatter = (referrals: ReferralForCvModel[]): string => {
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
  experiences: ExperienceForCvModel[]
): string => {
  return experiences
    .map(
      exp =>
        `Experience: ${exp.role} at ${exp.company?.name}, from ${exp.startedAt} to ${exp.finishedAt || 'present'}`
    )
    .join('\n')
}

export const projectFormatter = (projects: ProjectForCvModel[]): string => {
  return projects
    .map(
      project =>
        `Project: ${project.title}, Role: ${project.role}, Skills: ${project.skills.map(skill => skill.name).join(', ')}`
    )
    .join('\n')
}

export const companyFormatter = (companies: CompanyForCvModel[]): string => {
  return companies
    .map(company => `Company: ${company.name}, Link: ${company.link}`)
    .join('\n')
}

export function achievementFormatter(
  achievements: AchievementForCvModel[]
): string {
  return achievements
    .map(
      achievement =>
        `Title: ${achievement.title}\nDescription: ${achievement.description}`
    )
    .join('\n\n')
}

export function certificationFormatter(
  certificates: CertificationForCvModel[]
): string {
  return certificates
    .map(
      certificate =>
        `Certificate Name: ${certificate.name}\nDate: ${certificate.date.toLocaleDateString()}\nHours: ${certificate.hours}`
    )
    .join('\n\n')
}

export function characteristicFormatter(
  characteristics: CharacteristicForCvModel[]
): string {
  return characteristics
    .map(
      characteristic =>
        `Characteristic: ${characteristic.name}\nDetails: ${characteristic.details}`
    )
    .join('\n\n')
}

export function challengeFormatter(
  challenges: ChallengeForCvModel[]
): string {
  return challenges
    .map(
      challenge =>
        `Problem: ${challenge.problem}\nSolution: ${challenge.solution}`
    )
    .join('\n\n')
}

export function skillFormatter(skills: SkillForCvModel[]): string {
  return skills
    .map(
      (skill) =>
        `Skill: ${skill.name}\nExperience: ${skill.experienceYear || 'N/A'}\nType: ${skill.type}`
    )
    .join("\n\n");
}


export function languageFormatter(languages: LanguageForCvModel[]): string {
  return languages
    .map(
      (language) =>
        `Language: ${language.name}\nProficiency: ${language.proficiency || 'N/A'}`
    )
    .join("\n\n");
}
