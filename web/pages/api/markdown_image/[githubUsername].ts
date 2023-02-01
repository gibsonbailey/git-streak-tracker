import * as ejs from 'ejs'
import { getGithubContributions } from '../../../utils/githubContributions'
import { validateGitHubUsername } from '../../../utils/validation'

export default async function handler(req, res) {
    const { githubUsername } = req.query

    if (!validateGitHubUsername(githubUsername)) {
        res.status(400)
        res.end('url parameter githubUsername must be a valid GitHub username.',)
    }

    const contributionData = processContributionData(await getGithubContributions(githubUsername))
    const streakLength = contributionData.streakLength

    const svgData = await ejs.renderFile('utils/streak.svg', {
        hundredsPlace: Math.floor(streakLength / 100) % 10,
        tensPlace: Math.floor(streakLength / 10) % 10,
        onesPlace: Math.floor(streakLength / 1) % 10,
    }, {
        async: true,
    })

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'no-cache')
    res.end(svgData)
}

const processContributionData = (contributionData) => {
    let currentDateTime = new Date()
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    })
    currentDateTime = new Date(dateFormatter.format(currentDateTime))
    const todaysDateString = currentDateTime.toISOString().split('T')[ 0 ]
    let streakLength = 0
    let todayComplete = false
    let latestContributions = []
    let dayCount = 0
    weekLoop:
    for (let week of contributionData.data.user.contributionsCollection.contributionCalendar.weeks.reverse()) {
        for (let day of week.contributionDays.reverse()) {
            dayCount += 1
            const date = new Date(day.date)
            if (day.date === todaysDateString) {
                if (day.contributionCount > 0) {
                    todayComplete = true
                    streakLength += 1
                }
            } else if (date < currentDateTime) {
                if (day.contributionCount > 0) {
                    streakLength += 1
                } else {
                    if (dayCount > 7) {
                        break weekLoop
                    }
                }
            }
            if (dayCount <= 7) {
                latestContributions.push(day.contributionCount)
            }
        }
    }

    return {
        streakLength,
        todayComplete,
        latestContributions: latestContributions.reverse()
    }
}