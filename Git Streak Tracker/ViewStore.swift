//
//  ViewStore.swift
//  Git Streak Tracker
//
//  Created by Odd Thoughts on 2/8/23.
//

import Foundation

class ViewStore: ObservableObject {
    @Published var selectedTab: Int = 0
    
    func switchTab(tab: Int) {
        selectedTab = tab;
    }
}
