export const validateGitHubUsername = (username: string): boolean => {
    // Reject if username contains anything but alphanumeric and dash characters
    return /^[a-zA-Z0-9-]*$/.test(username)
}