//
//  Git_Streak_TrackerUnitTests.swift
//  Git Streak TrackerUnitTests
//
//  Created by Odd Thoughts on 2/9/23.
//

import XCTest
@testable import Git_Streak_Tracker

final class Git_Streak_TrackerUnitTestUtils: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() throws {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
        // Any test you write for XCTest can be annotated as throws and async.
        // Mark your test throws to produce an unexpected failure when your test encounters an uncaught error.
        // Mark your test async to allow awaiting for asynchronous code to complete. Check the results with assertions afterwards.
        XCTAssertTrue(true)
    }

    func testPerformanceExample() throws {
        // This is an example of a performance test case.
        measure {
            // Put the code you want to measure the time of here.
        }
    }

}

final class Test_isGHUsername: XCTestCase {
    func itChecksForValidLength() throws {
        let min = "1"
        let max = "123456789012345678901234567890123456789"
        let toLong = "1234567890123456789012345678901234567890"
        let toShort = ""
        
        XCTAssertTrue(isValidGHUsername(uname: min))
        XCTAssertTrue(isValidGHUsername(uname: max))
        XCTAssertFalse(isValidGHUsername(uname: toLong))
        XCTAssertFalse(isValidGHUsername(uname: toShort))
    }
    
    func itCannotStartWithADash() throws {
        let ok = "name"
        let fail = "-"
        let fail2 = "-name"
        
        XCTAssertTrue(isValidGHUsername(uname: ok))
        XCTAssertFalse(isValidGHUsername(uname: fail))
        XCTAssertFalse(isValidGHUsername(uname: fail2))
    }
    
    func itAcceptsAlphaNumericAndDash() {
        let alpha = "abc"
        let numeric = "123"
        let withDash = "def-123456789"
        let mixup = "ghijklmnopqrstuvwxyz0"
        
        let badSymbols = "!@#$%^&*()~/.,';:+=][{}|\""
        for chr in badSymbols {
            let strWithBad = "heya" + String(chr)
            XCTAssertFalse(isValidGHUsername(uname: strWithBad))
        }
        
        XCTAssertTrue(isValidGHUsername(uname: alpha))
        XCTAssertTrue(isValidGHUsername(uname: numeric))
        XCTAssertTrue(isValidGHUsername(uname: withDash))
        XCTAssertTrue(isValidGHUsername(uname: mixup))
    }
}
