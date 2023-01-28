import { getGithubContributions } from "../../../utils/githubContributions"


export default async function handler(req, res) {
    const { githubUsername } = req.query

    if (!githubUsername) {
        // TODO: Not sure how this would ever happen. Empty url parameter?
        throw Error('githubUsername query parameter required.')
    } else {
        // Reject if username contains anything but alphanumeric and dash characters
        if (!/^[a-zA-Z0-9-]*$/.test(githubUsername)) {
            // TODO: This serves 400 page. Probably not what we want. We want to serve the simple error message below.
            res.status(400)
            res.end('githubUsername must be a valid GitHub username.',)
        }
    }
    const contributionData = await getGithubContributions(githubUsername)
    res.end(JSON.stringify(contributionData))
}