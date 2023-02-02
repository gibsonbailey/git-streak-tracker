import { validateGitHubUsername } from '../../../utils/validation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
    const { githubUsername } = req.query

    if (!validateGitHubUsername(githubUsername)) {
        res.status(400)
        res.end('url parameter githubUsername must be a valid GitHub username.',)
    }

    const user = await prisma.user.findFirst({
        where: {
            username: githubUsername,
        },
        select: {
            view_count: true,
        }
    })
    res.end(JSON.stringify(user))
}
