//
//  AppGroup.swift
//  Git Streak Tracker
//
//  Created by Bailey Lind-Trefts on 1/8/23.
//

import Foundation

public enum AppGroup: String {
  case facts = "group.com.ckcollab.Git-Streak-Tracker"

  public var containerURL: URL {
    switch self {
    case .facts:
      return FileManager.default.containerURL(
      forSecurityApplicationGroupIdentifier: self.rawValue)!
    }
  }
}
