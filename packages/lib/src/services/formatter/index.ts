interface EducationForGpt {
  degree: string;
  description?: string | null;
  fieldOfStudy: string;
  finishedAt?: Date | null;
  gpa?: string | null;
  institution: string;
  institutionLink: string;
  startedAt: Date;
}

export const educationFormatter = (educations: EducationForGpt[]): string => {
  return educations
    .map(
      (edu) =>
        `Education: ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.institutionLink}),
      ${edu.startedAt} - ${edu.finishedAt || "present"}` +
        (edu.gpa ? `, GPA: ${edu.gpa}` : "") +
        (edu.description ? `, Description: ${edu.description}` : ""),
    )
    .join("\n");
};

interface ReferralForGpt {
  contactInfo?: string | null;
  feedback?: string | null;
  name?: string | null;
  recommendation?: string | null;
  relationship?: string | null;
}

export const referralFormatter = (referrals: ReferralForGpt[]): string => {
  return referrals
    .map(
      (referral) =>
        `Referral: ${referral.name || "Unknown"}, Relationship: ${referral.relationship || "N/A"},
      Feedback: ${referral.feedback || "No feedback"},
      Recommendation: ${referral.recommendation || "No recommendation"},
      Contact: ${referral.contactInfo || "No contact info"}`,
    )
    .join("\n");
};

interface ExperienceForGpt {
  company?: {
    name: string | null;
  };
  finishedAt?: string | null;
  role: string | null;
  startedAt: string | null;
}

export const experienceFormatter = (experiences: ExperienceForGpt[]): string => {
  return experiences
    .map(
      (exp) =>
        `Experience: ${exp.role} at ${exp.company?.name}, from ${exp.startedAt} to ${exp.finishedAt || "present"}`,
    )
    .join("\n");
};

interface ProjectForGpt {
  role: string | null;
  skills: { name: string | null }[];
  title: string | null;
}

export const projectFormatter = (projects: ProjectForGpt[]): string => {
  return projects
    .map(
      (project) =>
        `Project: ${project.title}, Role: ${project.role}, Skills: ${project.skills.map((skill) => skill.name).join(", ")}`,
    )
    .join("\n");
};

interface CompanyForGpt {
  link: string;
  name: string;
}

export const companyFormatter = (companies: CompanyForGpt[]): string => {
  return companies.map((company) => `Company: ${company.name}, Link: ${company.link}`).join("\n");
};
