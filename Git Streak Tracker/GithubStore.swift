//
//  GithubStore.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/25/23.
//

import Foundation
import WidgetKit

let contributionManager = ContributionManager()

let fileManager = FileManager.default
let storeURL = AppGroup.facts.containerURL.appendingPathComponent("githubUsername.txt")

class UserStore: ObservableObject {
    @Published var stagedContributionData: ContributionData
    @Published var contributionData: ContributionData
    @Published var fetching: Bool = false
    @Published var username: String = ""
    @Published var stagedUsername: String = ""
    @Published var error: Bool = false
    
    func stageUsername(username: String) -> Void {
        managedFetchContrubutions(username) { (username, newContributionData) in
            self.stagedContributionData = newContributionData
            self.stagedUsername = username
        }
    }
    
    func reloadContributionData() -> Void {
        managedFetchContrubutions(self.username) { (username, newContributionData) in
            self.contributionData = newContributionData
            WidgetCenter.shared.reloadAllTimelines()
        }
    }
    
    func managedFetchContrubutions(_ username: String, _ onSuccess: @escaping (_ username: String, _ newContributionData: ContributionData) -> Void) {
        fetching = true
        DispatchQueue.global().async {
            let newContributionData = contributionManager.getContributions(username)
            DispatchQueue.main.async {
                if (!newContributionData.error) {
                    self.error = false
                    onSuccess(username, newContributionData)
                } else {
                    self.error = true
                }
                self.fetching = false
            }
        }
    }
    
    func storeUsername() -> Void {
        username = stagedUsername
        contributionData = stagedContributionData
        storeGithubUsername(githubUsername: username)
        WidgetCenter.shared.reloadAllTimelines()
    }
    
    init(contributionData initialContributionData: ContributionData) {
        let loadedUsername = loadGithubUsername()
        username = loadedUsername
        stagedUsername = loadedUsername
        contributionData = initialContributionData
        stagedContributionData = initialContributionData
        WidgetCenter.shared.reloadAllTimelines()
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


