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
    @EnvironmentObject private var viewStore: ViewStore
    
    func onAppear(){
        if !userStore.username.isEmpty {
            userStore.setUsername(username: userStore.username) // triggers an update
        } else {
            viewStore.switchTab(tab: 1) // if no username exists in storage, send them to settings page
        }
    }
        
    var body: some View {
        ZStack {
            TabView(selection: $viewStore.selectedTab) {
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
            .animation(.easeInOut, value: viewStore.selectedTab) // 2
            
            if !userStore.username.isEmpty {
                GeometryReader { geometry in
                    HStack {
                        
                        Spacer()
                        
                        FontIcon.button(
                            .materialIcon(code: .person),
                            action: {
                                viewStore.switchTab(tab:0)
                            },
                            padding: 0,
                            fontsize: 45,
                            color: viewStore.selectedTab == 0 ? ColorPallete.highlightGreen : ColorPallete.midWhite
                        )
                        .shadow(color: viewStore.selectedTab == 0 ? ColorPallete.highlightGreen : .clear, radius: 4, x: 0, y: 0)
                        
                        Spacer()
                        Spacer()
                        
                        FontIcon.button(
                            .ionicon(code: .ios_settings),
                            action: {
                                viewStore.switchTab(tab:1)
                            },
                            padding: 0,
                            fontsize: 45,
                            color: viewStore.selectedTab == 1 ? ColorPallete.highlightGreen : ColorPallete.midWhite
                        )
                        .shadow(color: viewStore.selectedTab == 1 ? ColorPallete.highlightGreen : .clear, radius: 4, x: 0, y: 0)
                        
                        Spacer()
                        // When we wanna animate this all pretty like the designs, watch this: https://www.youtube.com/watch?v=lzmKrJCuxwM&t=221s&ab_channel=Kavsoft
                        
                    }
                    .ignoresSafeArea()
                    .frame(width: 135)
                    .padding(20)
                    .background(ColorPallete.darkGreen)
                    .cornerRadius(20)
                    .position(x:200, y: geometry.size.height - 100)
                }
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
            .environmentObject(ViewStore())
    }
}
