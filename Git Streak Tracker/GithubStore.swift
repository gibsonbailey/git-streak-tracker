//
//  GithubStore.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/25/23.
//

import Foundation

let contributionManager = ContributionManager()

class UserStore: ObservableObject {
    @Published var contributionData: ContributionData
    @Published var username: String {
        didSet {
            storeGithubUsername(githubUsername: username)
            self.contributionData = contributionManager.getContributions(username)
//            contributionManager.getContributions(username)
        }
    }
    
    init(username: String, contributionData: ContributionData) {
        self.username = loadGithubUsername()
        self.contributionData = contributionData
    }
}

func storeGithubUsername(githubUsername: String) {
    manager.createFile(
        atPath: storeURL.path,
        contents: githubUsername.data(using: .utf8)
    )
}

class UserInfo: ObservableObject {
    @Published var username: String
    @Published var contributionData: ContributionData
    let contributionManager = ContributionManager()
    init(username: String) {
        let githubUsername = loadGithubUsername()
        self.username = githubUsername
        self.contributionData = contributionManager.getContributions(githubUsername)
    }
    
    func storeGithubUsername(githubUsername: String) -> String {
        manager.createFile(
            atPath: storeURL.path,
            contents: githubUsername.data(using: .utf8)
        )
        self.username = githubUsername
        self.contributionData = contributionManager.getContributions(githubUsername)
        return githubUsername
    }
}

let manager = FileManager.default
let storeURL = AppGroup.facts.containerURL.appendingPathComponent("githubUsername.txt")

func loadGithubUsername() -> String {
    if manager.fileExists(atPath: storeURL.path) {
        if let data = manager.contents(atPath: storeURL.path) {
            let username = String(decoding: data, as: UTF8.self)
            return username
        }
    }
    return ""
}


