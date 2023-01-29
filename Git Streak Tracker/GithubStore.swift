//
//  GithubStore.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/25/23.
//

import Foundation

let contributionManager = ContributionManager()

let fileManager = FileManager.default
let storeURL = AppGroup.facts.containerURL.appendingPathComponent("githubUsername.txt")

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
    fileManager.createFile(
        atPath: storeURL.path,
        contents: githubUsername.data(using: .utf8)
    )
}


func loadGithubUsername() -> String {
    if fileManager.fileExists(atPath: storeURL.path) {
        if let data = fileManager.contents(atPath: storeURL.path) {
            let username = String(decoding: data, as: UTF8.self)
            return username
        }
    }
    return ""
}


