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
    @State private var inputValue: String = ""
    @State private var githubUsernameDisplayed: String = ""
    @EnvironmentObject private var userStore: UserStore

    func storeUsername() {
        userStore.username = inputValue // everytime username changes, the contributions are requested,
    }
    
    var body: some View {
        GeometryReader { bounds in
            VStack {
                Form {
                    Section {
                        TextField("Github Username", text: $inputValue)
                    }
                    if userStore.username != "" {
                        Text("Username set to: " + userStore.username)
                    }
                }
                
                Button(action: {
                    storeUsername()
                }, label: {
                    Text("Save")
                        .textInputAutocapitalization(.never)
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                        .frame(width: 200, height: 60, alignment: .center)
                        .fontWeight(.bold)
                        .background(.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                        .disabled(inputValue == "")
                })
            }
            .frame(width: bounds.size.width, height: bounds.size.height, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
        }
    }
}


struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(UserStore(username: "", contributionData: ContributionData()))
    }
}
