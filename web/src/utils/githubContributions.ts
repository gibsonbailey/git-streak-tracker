export const getGithubContributions = async (username: string) => {
    const graphQueryData = {
        query: `query {
                    user(login: "${username}") {
                        name
                        avatarUrl
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
    return data
}