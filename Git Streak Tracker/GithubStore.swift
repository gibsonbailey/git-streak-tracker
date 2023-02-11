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
    @Published var contributionData: ContributionData
    private var stagedContributionData: ContributionData
    @Published var fetching: Bool = false
    @Published var username: String = ""
    @Published var stagedUsername: String = ""
    @Published var error: Bool = false
    
    func stageUsername(username: String) -> Void {
        managedFetchContrubutions(username) { (username, contributionData) in
            self.stagedContributionData = contributionData
            self.stagedUsername = username
        }
    }
    
    func reloadContributionData() -> Void {
        managedFetchContrubutions(self.username) { (username, contributionData) in
            self.contributionData = contributionData
            WidgetCenter.shared.reloadAllTimelines()
        }
    }
    
    func managedFetchContrubutions(_ username: String, _ onSuccess: @escaping (_ username: String, _ contributionData: ContributionData) -> Void) {
        self.fetching = true
        DispatchQueue.global().async {
            let contributionData = contributionManager.getContributions(self.username)
            DispatchQueue.main.async {
                if (!contributionData.error) {
                    self.error = false
                    onSuccess(username, contributionData)
                } else {
                    self.error = true
                }
                self.fetching = false
            }
        }
    }
    
    func storeUsername() -> Void {
        self.username = self.stagedUsername
        self.contributionData = self.stagedContributionData
        storeGithubUsername(githubUsername: self.username)
        WidgetCenter.shared.reloadAllTimelines()
    }
    
    init(contributionData: ContributionData) {
        let username = loadGithubUsername()
        self.username = username
        self.stagedUsername = username
        self.contributionData = contributionData
        self.stagedContributionData = contributionData
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


