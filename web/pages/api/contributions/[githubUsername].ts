import { getGithubContributions } from "../../../utils/githubContributions"
import { validateGitHubUsername } from "../../../utils/validation"


export default async function handler(req, res) {
    const { githubUsername } = req.query

    if (!validateGitHubUsername(githubUsername)) {
        res.status(400)
        res.end('url parameter githubUsername must be a valid GitHub username.',)
    }

    const contributionData = await getGithubContributions(githubUsername)
    res.end(JSON.stringify(contributionData))
}