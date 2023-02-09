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
    @Published var fetching: Bool = false
    @Published var username: String
    
    func setUsername(username: String) -> Void {
        self.fetching = true
        DispatchQueue.global().async {
            self.contributionData = contributionManager.getContributions(username)
            DispatchQueue.main.async {
                if (!self.contributionData.error) {
                    self.username = username
                } else {
                    self.username = ""
                }
                self.fetching = false
            }
        }
    }
    
    func storeUsername() -> Void {
        storeGithubUsername(githubUsername: self.username)
    }
    
    init(username: String, contributionData: ContributionData) {
        self.username = loadGithubUsername() // not using sefl.loadUsername because it was yelling at me for calling it before initialization or something
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


