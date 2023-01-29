//
//  Contributions.swift
//  Git Streak Tracker
//
//  Created by Bailey Lind-Trefts on 1/7/23.
//

import Foundation


struct ResponseData : Decodable {
    let data: BaseData
}

struct BaseData : Decodable {
    let user: UserData
}

struct UserData : Decodable {
    let contributionsCollection: ContributionsCollection
    let name: String
    let avatarUrl : String
}

struct ContributionsCollection : Decodable {
    let contributionCalendar: ContributionCalendar
}

struct ContributionCalendar : Decodable {
    let weeks: [Week]
}

struct Week : Decodable {
    let contributionDays: [ContributionDay]
}

struct ContributionDay : Decodable {
    var contributionCount: Int = 1
    var weekday: Int = 0
    var date: String = "2023-01-10"
}

struct ContributionData {
    var streakLength: Int = 0
    var todayComplete: Bool = true
    var latestContributions: [Int] = []
    var allContributions: [ContributionDay] = []
    var name: String = ""
    var avatarUrl: String = ""
}

class ContributionManager {
    private func fetchContributions(_ githubUsername: String) -> ResponseData? {
        if githubUsername == "" {
            return nil
        }
        let url = URL(string: "https://git-streak-tracker.herokuapp.com/api/contributions/\(githubUsername)")!
        var data: Data?
        let semaphore = DispatchSemaphore(value: 0)
        
        let task = URLSession.shared.dataTask(with: url) { (d, _, _) in
            data = d
            semaphore.signal()
        }
        task.resume()
        
        semaphore.wait()
        
        guard let successData = data else { return nil }
        
        do {
            let todo = try JSONDecoder().decode(ResponseData.self, from: successData)
            return todo
        } catch {
            return nil
        }
    }

    func getContributions(_ githubUsername: String) -> ContributionData {
        guard let contributionData = fetchContributions(githubUsername) else {
            return ContributionData(
                streakLength: 0,
                todayComplete: false,
                latestContributions: [],
                allContributions: [],
                name: ""
            )
        }
        var currentDateTime = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let todaysDateString = dateFormatter.string(from: currentDateTime)
        currentDateTime = dateFormatter.date(from: todaysDateString)!
        var streakLength = 0
        var streakBroken = false
        var todayComplete = false
        var latestContributions: [Int] = []
        var allContributions: [ContributionDay] = []
        var contributionCollectionCounter = 0
        contributionData.data.user.contributionsCollection.contributionCalendar.weeks.reversed().forEach { week in
            week.contributionDays.reversed().forEach { day in
                let date = dateFormatter.date(from: day.date)!
                if date == currentDateTime {
                    if day.contributionCount > 0 {
                        todayComplete = true
                        streakLength += 1
                    }
                    contributionCollectionCounter = 7
                } else if date < currentDateTime {
                    if day.contributionCount > 0 {
                        if !streakBroken {
                            streakLength += 1
                        }
                    } else {
                        streakBroken = true
                    }
                }
                if contributionCollectionCounter > 0 {
                    latestContributions.append(day.contributionCount)
                    contributionCollectionCounter -= 1
                }
                allContributions.append(ContributionDay(
                    contributionCount: day.contributionCount,
                    weekday: day.weekday,
                    date: day.date
                ))
            }
        }
        
        return ContributionData(
            streakLength: streakLength,
            todayComplete: todayComplete,
            latestContributions: latestContributions.reversed(),
            allContributions: allContributions.reversed().suffix(126),
            name: contributionData.data.user.name,
            avatarUrl: contributionData.data.user.avatarUrl
        )
    }
}
