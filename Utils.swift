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

// based on https://gist.github.com/tonybruess/9405134
func isValidGHUsername(uname: String) -> Bool {
    let len = uname.count
    if (len < 1 || len > 39) {
        return false
    }
    
    if uname.first == "-" {
        return false
    }
    
    for chr in uname {
        if (!(chr.isNumber || chr.isLetter || chr == "-")) {
            return false
        }
    }
    return true
}
