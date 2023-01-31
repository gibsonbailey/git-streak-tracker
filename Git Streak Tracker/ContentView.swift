//
//  ContentView.swift
//  Git Streak Tracker
//
//  Created by Bailey Lind-Trefts on 1/6/23.
//

import SwiftUI
import WidgetKit
import SwiftUIFontIcon



struct ContentView: View {
    @EnvironmentObject private var userStore: UserStore
    @State private var selectedTab = 0
    @State private var slide = true // for the slide effect when swapping tabs by clicking buttons
    
    func switchTab(tab: Int) {
        // Go to screen
        selectedTab = tab
        slide = !slide
    }
    
    func onAppear(){
        if !userStore.username.isEmpty {
            userStore.username = userStore.username // triggers an update
        } else {
            selectedTab = 1 // if no username exists in storage, send them to settings page
        }
    }
    
    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                VStack {
                    ProfileOverviewView()
                }
                .tag(0)
                VStack {
                    SettingsView()
                }
                .tag(1)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .indexViewStyle(.page(backgroundDisplayMode: .interactive))
            .animation(.easeInOut, value: slide) // 2
            
            if !userStore.username.isEmpty {
                HStack {
                    
                    Spacer()
                    
                    FontIcon.button(
                        .materialIcon(code: .person),
                        action: {
                            switchTab(tab:0)
                        },
                        padding: 0,
                        fontsize: 45,
                        color: selectedTab == 0 ? ColorPallete.highlightGreen : ColorPallete.midWhite
                    )
                    .shadow(color: selectedTab == 0 ? ColorPallete.highlightGreen : .clear, radius: 4, x: 0, y: 0)
                    
                    Spacer()
                    Spacer()
                    
                    FontIcon.button(
                        .ionicon(code: .ios_settings),
                        action: {
                            switchTab(tab:1)
                        },
                        padding: 0,
                        fontsize: 45,
                        color: selectedTab == 1 ? ColorPallete.highlightGreen : ColorPallete.midWhite
                    )
                    .shadow(color: selectedTab == 1 ? ColorPallete.highlightGreen : .clear, radius: 4, x: 0, y: 0)
                    
                    Spacer()
                    // When we wanna animate this all pretty like the designs, watch this: https://www.youtube.com/watch?v=lzmKrJCuxwM&t=221s&ab_channel=Kavsoft
                    
                }
                .ignoresSafeArea()
                .frame(width: 135)
                .padding(20)
                .background(ColorPallete.darkGreen)
                .cornerRadius(20)
                .position(x:200, y: 700)
            }
        }
        .ignoresSafeArea()
        .onAppear(perform: onAppear)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(UserStore(username: "", contributionData: ContributionData()))
    }
}
