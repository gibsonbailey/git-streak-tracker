//
//  SettingsView.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/15/23.
//

import Foundation
import SwiftUI
import WidgetKit

struct SettingsView: View {
    @State private var githubUsername: String = ""
    @State private var githubUsernameDisplayed: String = ""
    let storeURL = AppGroup.facts.containerURL.appendingPathComponent("githubUsername.txt")
    let manager = FileManager.default
    
    private func storeGithubUsername() {
        manager.createFile(
            atPath: storeURL.path,
            contents: githubUsername.data(using: .utf8)
        )
        WidgetCenter.shared.reloadAllTimelines()
        githubUsernameDisplayed = githubUsername
    }
    
    private func loadGithubUsername() {
        if manager.fileExists(atPath: storeURL.path) {
            if let data = manager.contents(atPath: storeURL.path) {
                githubUsername = String(decoding: data, as: UTF8.self)
                githubUsernameDisplayed = githubUsername
            }
        }
    }
    
    
    var body: some View {
        GeometryReader { bounds in
            VStack {
                Form {
                    Section {
                        TextField("Github Username", text: $githubUsername)
                    }
                }
                if githubUsernameDisplayed != "" {
                    Text("Username set to \(githubUsernameDisplayed). Check your widget!")
                }
                Button(action: {
                    storeGithubUsername()
                }, label: {
                    Text("Save")
                        .textInputAutocapitalization(.never)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 200, height: 20, alignment: .center)
                        .padding(.top, 24)
                        .fontWeight(.bold)
                        .background(.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                        .disabled(githubUsername == "")
                })
            }
            .frame(width: bounds.size.width, height: bounds.size.height, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
        }
        .background(Color.blue)
//        .edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
    }
}


struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}
