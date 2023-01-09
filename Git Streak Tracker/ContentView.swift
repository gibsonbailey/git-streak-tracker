//
//  ContentView.swift
//  Git Streak Tracker
//
//  Created by Bailey Lind-Trefts on 1/6/23.
//

import SwiftUI
import WidgetKit

struct ContentView: View {
    @State private var githubUsername: String = ""
    let storeURL = AppGroup.facts.containerURL.appendingPathComponent("githubUsername.txt")
    let manager = FileManager.default
    
    private func storeGithubUsername() {
        manager.createFile(
            atPath: storeURL.path,
            contents: githubUsername.data(using: .utf8)
        )
        WidgetCenter.shared.reloadAllTimelines()
    }
    
    private func loadGithubUsername() {
        if manager.fileExists(atPath: storeURL.path) {
            if let data = manager.contents(atPath: storeURL.path) {
                githubUsername = String(decoding: data, as: UTF8.self)
            }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                Form {
                    Section {
                        TextField("Github Username", text: $githubUsername)
                    }
                }
                Button(action: {
                    storeGithubUsername()
                }, label: {
                    Text("Save")
                        .textInputAutocapitalization(.never)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 200, height: 50, alignment: .center)
                        .background(.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                })
            }
            .navigationTitle("Github Streak Tracker")
        }.onAppear(perform: {
            loadGithubUsername()
        })
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
