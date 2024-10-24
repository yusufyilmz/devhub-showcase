export const notifications = {
  success: {
    projectAdded: 'Project added successfully!',
    projectUpdated: 'Project updated successfully!',
    referralApproved: (name: string) =>
      `Referral of '${name}' approved successfully`
  },
  errors: {
    fetchProjectError: 'Failed to fetch project details. Please try again.',
    updateProjectError: 'Failed to update project. Please try again.',
    addProjectError: 'Failed to add project. Please try again.',
    projectAddFailed: 'Failed to add project. Please try again.',
    projectAddError: 'An error occurred while adding the project.',
    validationError: 'An error occurred on validating api parameters.',
    projectNotFound: 'Project not found.',
    invalidId: 'Invalid Project ID.',
    referralApproveError: 'An error occurred on approving the review.'
  }
}
