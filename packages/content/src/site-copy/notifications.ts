export const notifications = {
  errors: {
    addProjectError: "Failed to add project. Please try again.",
    fetchProjectError: "Failed to fetch project details. Please try again.",
    invalidId: "Invalid Project ID.",
    projectAddError: "An error occurred while adding the project.",
    projectAddFailed: "Failed to add project. Please try again.",
    projectNotFound: "Project not found.",
    referralApproveError: "An error occurred on approving the review.",
    tooManyRequests: "Too many requests. Please try again later.",
    updateProjectError: "Failed to update project. Please try again.",
    validationError: "An error occurred on validating api parameters.",
  },
  success: {
    projectAdded: "Project added successfully!",
    projectUpdated: "Project updated successfully!",
    referralApproved: (name: string) => `Referral of '${name}' approved successfully`,
    referralRejected: (name: string) => `Referral of '${name}' rejected successfully`,
  },
};
