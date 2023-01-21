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
    
    private func go_to() {
        // Go to screen
    }

    
    var body: some View {
        ZStack {
            TabView {
                ZStack {
                    ProfileOverviewView()
                }
                ZStack {
                    SettingsView()
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .indexViewStyle(.page(backgroundDisplayMode: .interactive))
            
            HStack {
                Spacer()
                FontIcon.button(.materialIcon(code: .person), action: {
                    go_to()
                }, padding: 0, fontsize: 45, color: ColorPallete.midWhite)
//                .shadow(color: ColorPallete.highlightGreen, radius: 4, x: 0, y: 0)
                Spacer()
                Spacer()
                FontIcon.button(.ionicon(code: .ios_settings), action: {
                    go_to()
                }, padding: 0, fontsize: 45, color: ColorPallete.midWhite)
//                .shadow(color: ColorPallete.highlightGreen, radius: 4, x: 0, y: 0)
                Spacer()
                // When we wanna animate this all pretty like watch this: https://www.youtube.com/watch?v=lzmKrJCuxwM&t=221s&ab_channel=Kavsoft
                
            }
            .ignoresSafeArea()
            .frame(width: 135)
            .padding(20)
            .background(ColorPallete.darkGreen)
            .cornerRadius(20)
            .position(x:200, y: 700)
        }.ignoresSafeArea()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
