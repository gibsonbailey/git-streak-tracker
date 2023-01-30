//
//  SettingsView.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/15/23.
//

import Foundation
import SwiftUI
import WidgetKit
import SwiftUIFontIcon

struct SettingsView: View {
    @EnvironmentObject private var userStore: UserStore
    @State private var inputValue: String = ""
    @State private var githubUsernameDisplayed: String = ""

    let debouncer = Debouncer(delay: 0.5)
    
    func storeUsername() {
        userStore.username = inputValue // everytime username changes, the contributions are requested
        WidgetCenter.shared.reloadAllTimelines()
    }
    
    var body: some View {
        GeometryReader { bounds in
            VStack {
                VStack {
                    Text("Enter your GitHub")
                        .font(.system(size: 25))
                        .foregroundColor(.white)
                    Text("username")
                        .font(.system(size: 25))
                        .foregroundColor(.white)
                    Text("In return, we’ll help you maintain your GitHub contributions streak and take your profile to the next level.")
                        .opacity(0.6)
                        .font(.system(size: 12))
                        .foregroundColor(.white)
                        .padding([.top, .bottom], 10)
                }
                .frame(width: 200, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                Section {
                    ZStack {
                        TextField("", text: $inputValue)
                            .foregroundColor(.white)
                            .frame(height: 75)
                            .padding([.bottom], -20)
                            .padding([.horizontal], 8)
                            .overlay(RoundedRectangle(cornerRadius: 6).stroke(
                                inputValue.isEmpty ? .clear : ColorPallete.highlightGreen
                            ))
                            .background(ColorPallete.midGreen)
                            .cornerRadius(6)
                            .padding([.horizontal], 24)
                            .shadow(color: !inputValue.isEmpty ? ColorPallete.highlightGreen : .clear, radius: 4, x: 0, y: 0)
                            .autocorrectionDisabled()
                            .autocapitalization(.none)
                            .onChange(of: inputValue) { value in
                                self.debouncer.renewInterval {
                                    storeUsername()
                                }
                            }
                        
                        HStack {
                            Text("GitHub Username")
                                .foregroundColor(ColorPallete.lightestGreen)
                                .font(.system(size: 14))
                            if userStore.fetching {
                                SpinnerCircle()
                                    .offset(x: -2, y: 1)
                            } else {
                                FontIcon.text(
                                    .ionicon(code: .md_checkmark_circle),
                                    fontsize: 12,
                                    color: ColorPallete.highlightGreen
                                )
                                .offset(x: -4, y: 1)
                            }

                        }.offset(x: -55, y: -16)
                    }
                }
                .frame(width: 300, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                .padding(.top, 10)
                
                if userStore.username != "" {
                    Text("Username set to: " + userStore.username)
                }
            }
            .padding(20)
            .frame(width: bounds.size.width, height: bounds.size.height, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
            .background(Gradient(colors: [ColorPallete.darkerGreen, ColorPallete.darkGreen]))
        }
    }
}


struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(UserStore(username: "", contributionData: ContributionData()))
    }
}


struct SpinnerCircle: View {
    @State var spinnerStart: CGFloat = 0.0
    @State var spinnerEnd: CGFloat = 0.0
    var color: Color = .green
    var lineWidth: CGFloat = 1
    var width: CGFloat = 10
    var height: CGFloat = 10

    let timer = Timer.publish(every: 0.005, on: .main, in: .common).autoconnect()

    var body: some View {
        Circle()
            .trim(from: CGFloat(spinnerStart), to: CGFloat(spinnerEnd))
            .stroke(style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
            .fill(color)
            .frame(width: width, height: height)
            .onReceive(timer) { input in
                    withAnimation(.easeIn(duration: 0.05).speed(10)){
                        if spinnerEnd < 1.0 {
                            spinnerEnd += 0.01
                        }
                        else {
                            spinnerStart += 0.01
                            if spinnerStart >= 1.0 {
                                spinnerStart = 0.0
                                spinnerEnd = 0.01
                                
                            }
                        }
                    }
            }
    }
}
