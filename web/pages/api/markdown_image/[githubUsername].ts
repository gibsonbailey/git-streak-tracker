import * as TextSVG from 'text-svg'

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
            res.end('githubUsername must be a valid GitHub username.', )
        }
    }

    const contributionData = await getGithubContributions(githubUsername)
    const svgData = TextSVG(`${contributionData.streakLength} DAYS`, { color: 'white', backgroundColor: 'black', padding: 30 })
    res.end(svgData)
}

const getGithubContributions = async (username: string) => {
    const graphQueryData = {
        query: `query {
                    user(login: "${username}") {
                        name
                        contributionsCollection {
                            contributionCalendar {
                                colors
                                totalContributions
                                    weeks {
                                        contributionDays {
                                            color
                                            contributionCount
                                            date
                                            weekday
                                    }
                                    firstDay
                                }
                            }
                        }
                    }
                }`
    }
    const token = process.env.GITHUB_STREAK_TRACKER_PRIVATE_TOKEN
    if (token === undefined) {
        console.error('GITHUB_STREAK_TRACKER_PRIVATE_TOKEN environment variable not set!!!')
        throw Error()
    }
    const resp = await fetch(
        'https://api.github.com/graphql',
        {
            method: 'POST',
            headers: {
                Authorization: `bearer ${token}`,
            },
            body: JSON.stringify(graphQueryData),
        }
    )
    /* TODO: Handle errors:
        * Github is down
        * Username does not exist
        * Query malformed
    */
    const data = await resp.json()
    return processContributionData(data)
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