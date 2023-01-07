//
//  Git_Streak_Tracker_WidgetBundle.swift
//  Git Streak Tracker Widget
//
//  Created by Bailey Lind-Trefts on 1/6/23.
//

import WidgetKit
import SwiftUI

@main
struct Git_Streak_Tracker_WidgetBundle: WidgetBundle {
    var body: some Widget {
        Git_Streak_Tracker_Widget()
        Git_Streak_Tracker_WidgetLiveActivity()
    }
}
