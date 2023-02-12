//
//  Git_Streak_TrackerApp.swift
//  Git Streak Tracker
//
//  Created by Bailey Lind-Trefts on 1/6/23.
//

import SwiftUI

@main
struct Git_Streak_TrackerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(UserStore(contributionData: ContributionData()))
                .environmentObject(ViewStore())
        }
    }
}
