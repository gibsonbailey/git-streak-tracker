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
    let contributionCount: Int
    let weekday: Int
    let date: String
}

struct ContributionData {
    let streakLength: Int
    let todayComplete: Bool
    let latestContributions: [Int]
}

class ContributionManager {
    private func fetchContributions() -> ResponseData? {
        let url = URL(string: "http://localhost:5000/")!
        var data: Data?
        let semaphore = DispatchSemaphore(value: 0)
        
        let task = URLSession.shared.dataTask(with: url) { (d, _, _) in
            data = d
            semaphore.signal()
        }
        task.resume()
        
        semaphore.wait()
        
        guard let successData = data else { return nil }
        
        print(successData)
        
        do {
            let todo = try JSONDecoder().decode(ResponseData.self, from: successData)
            print("x")
            return todo
        } catch {
            return nil
        }
    }



    func getContributions() -> ContributionData? {
        guard let contributionData = fetchContributions() else { return nil }
        var currentDateTime = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let todaysDateString = dateFormatter.string(from: currentDateTime)
        currentDateTime = dateFormatter.date(from: todaysDateString)!
        var streakLength = 0
        var streakBroken = false
        var todayComplete = false
        var latestContributions: [Int] = []
        var contributionCollectionCounter = 0
        contributionData.data.user.contributionsCollection.contributionCalendar.weeks.reversed().forEach { week in
            week.contributionDays.reversed().forEach { day in
                let date = dateFormatter.date(from: day.date)!
                if date == currentDateTime {
                    if day.contributionCount > 0 {
                        todayComplete = true
                        streakLength += 1
                    }
                    contributionCollectionCounter = 6
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
            }
        }
        return ContributionData(
            streakLength: streakLength,
            todayComplete: todayComplete,
            latestContributions: latestContributions.reversed()
        )
    }
}
