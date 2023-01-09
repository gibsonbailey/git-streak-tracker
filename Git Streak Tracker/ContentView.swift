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
        print(storeURL)
        print("ABCDE")
        
        manager.createFile(
            atPath: storeURL.path,
            contents: githubUsername.data(using: .utf8)
        )
        WidgetCenter.shared.reloadAllTimelines()
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
                        .frame(width: 200, height: 50, alignment: .center)
                        .background(.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                })
            }
            .navigationTitle("Github Streak Tracker")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
