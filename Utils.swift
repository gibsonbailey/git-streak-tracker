//
//  Utils.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/29/23.
//

import Foundation

class Debouncer {
    var timer: Timer?
    let delay: TimeInterval

    init(delay: TimeInterval) {
        self.delay = delay
    }

    func renewInterval(closure: @escaping () -> ()) {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: delay, repeats: false, block: { [weak self] timer in
            self?.timer = nil
            closure()
        })
    }

    deinit {
        timer?.invalidate()
    }
}

func isValidGHUsername(uname: String) -> Bool {
    return true
}
