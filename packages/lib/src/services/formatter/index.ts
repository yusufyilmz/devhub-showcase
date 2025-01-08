interface EducationForGpt {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  institutionLink: string;
  startedAt: Date;
  finishedAt?: Date | null;
  gpa?: string | null;
  description?: string | null;
}

export const educationFormatter = (
  educations: EducationForGpt[]
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

interface ReferralForGpt {
  name?: string | null;
  relationship?: string | null;
  feedback?: string | null;
  recommendation?: string | null;
  contactInfo?: string | null;
}

export const referralFormatter = (referrals: ReferralForGpt[]): string => {
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

interface ExperienceForGpt {
  role: string | null;
  company?: {
    name: string | null;
  };
  startedAt: string | null;
  finishedAt?: string | null;
}

export const experienceFormatter = (
  experiences: ExperienceForGpt[]
): string => {
  return experiences
    .map(
      exp =>
        `Experience: ${exp.role} at ${exp.company?.name}, from ${exp.startedAt} to ${exp.finishedAt || 'present'}`
    )
    .join('\n')
}

interface ProjectForGpt {
  title: string | null;
  role: string | null;
  skills: { name: string | null }[];
}

export const projectFormatter = (projects: ProjectForGpt[]): string => {
  return projects
    .map(
      project =>
        `Project: ${project.title}, Role: ${project.role}, Skills: ${project.skills.map(skill => skill.name).join(', ')}`
    )
    .join('\n')
}

interface CompanyForGpt {
  name: string;
  link: string;
}

export const companyFormatter = (companies: CompanyForGpt[]): string => {
  return companies
    .map(company => `Company: ${company.name}, Link: ${company.link}`)
    .join('\n')
}
