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
    @EnvironmentObject private var viewStore: ViewStore
    @State private var inputValue: String = ""
    @State private var isEditing = false
    
    let debouncer = Debouncer(delay: 0.5)
    
    // Actions
    func loadInputField() {
        inputValue = userStore.username
    }
    
    func handleInputChanged() {
        inputValue = inputValue.trimmingCharacters(in: .whitespacesAndNewlines)
        self.debouncer.renewInterval {
            handleInputChangeDebounced()
        }
    }
    
    func handleInputChangeDebounced() {
        if !isValidGHUsername(uname: inputValue) {
            userStore.error = true
            return
        }
        
        userStore.setUsername(username: inputValue)
        WidgetCenter.shared.reloadAllTimelines()
    }
    
    func handleSaveUsernamePress() {
        // everytime username changes, the contributions are requested
        userStore.storeUsername()
        viewStore.switchTab(tab: 0)
    }
    
    // Computed
    func getShadeColor() -> Color{
        if userStore.error {
            return ColorPallete.midRed
        }
        return isEditing ? ColorPallete.highlightGreen : .clear
    }
    
    func isSaveUsernameDisabled() -> Bool {
        if (
            !userStore.error &&
            userStore.username.count > 1 &&
            inputValue == userStore.username
        ) {
            return false
        }
        
        return userStore.error || userStore.fetching || inputValue != userStore.username || inputValue == ""
    }
    
    func getSaveUsernameBg() -> LinearGradient {
        let gradientColors = !isSaveUsernameDisabled()
            ? [ColorPallete.yellowGreen, ColorPallete.highlightGreen]
            : [ColorPallete.midGreen]
        
        return LinearGradient(
            gradient: Gradient(colors: gradientColors),
            startPoint: .leading,
            endPoint: .trailing
        )
    }
    
    func getSaveUsernameTextColor() -> Color {
        if (isSaveUsernameDisabled()) {
            return ColorPallete.navLow;
        }
        
        return .white
    }
    
    func getIconColor() -> Color {
        if (userStore.error) {
            return ColorPallete.midRed
        }
        
        if (userStore.username.isEmpty || inputValue.isEmpty || userStore.username != inputValue) {
            return .clear
        }
        
        return ColorPallete.highlightGreen
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
                    Text("In return, we’ll help you maintain your GitHub contribution streak and take your profile to the next level.")
                        .opacity(0.6)
                        .font(.system(size: 12))
                        .foregroundColor(.white)
                        .padding([.top, .bottom], 10)
                }
                .frame(width: 216, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                Section {
                    ZStack {
                        TextField("", text: $inputValue, onEditingChanged: { editing in
                            DispatchQueue.main.async {
                                isEditing = editing
                            }
                        })
                        .foregroundColor(.white)
                        .frame(height: 75)
                        .padding([.bottom], -20)
                        .padding([.horizontal], 10)
                        .overlay(RoundedRectangle(cornerRadius: 6).stroke(
                            getShadeColor()
                        ))
                        .background(userStore.error ? ColorPallete.darkRed : ColorPallete.midGreen)
                        .cornerRadius(6)
                        .padding([.horizontal], 14)
                        .shadow(color: getShadeColor(), radius: 4, x: 0, y: 0)
                        .autocorrectionDisabled()
                        .autocapitalization(.none)
                        .onChange(of: inputValue) { value in
                            handleInputChanged()
                        }
                        .onAppear {
                            loadInputField()
                        }
                 
                            
                            
                        HStack {
                            Text("GitHub Username")
                                .foregroundColor(ColorPallete.lightestGreen)
                                .font(.system(size: 14))
                            if userStore.fetching {
                                SpinnerCircle(
                                    color: userStore.error ? ColorPallete.midRed : ColorPallete.highlightGreen
                                )
                                .offset(x: -2, y: 1)
                            }
                            else {
                                FontIcon.text(
                                    .ionicon(code: userStore.error ? .md_close_circle : .md_checkmark_circle),
                                    fontsize: 12,
                                    color: getIconColor()
                                )
                                .offset(x: -4, y: 1)
                            }

                        }.offset(x: -60, y: -16)

                    }
                }
                .frame(width: 300, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                .padding(.top, 10)
                
                HStack {
                    Button(action: handleSaveUsernamePress) {
                        Text("Save Username")
                            .fontWeight(Font.Weight.bold)
                            .frame(width: 272, height: 48)
                            .foregroundColor(getSaveUsernameTextColor())
                            .background(getSaveUsernameBg())
                    }
                    .disabled(isSaveUsernameDisabled())
                    .cornerRadius(6)
                }
                .padding([.top], 40)
            }
            .padding(20)
            .padding(.bottom, 200)
            .frame(width: bounds.size.width, height: bounds.size.height, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
            .background(Gradient(colors: [ColorPallete.darkerGreen, ColorPallete.darkGreen]))
        }
    }
}


struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(UserStore(username: "", contributionData: ContributionData()))
            .environmentObject(ViewStore())
    }
}


struct SpinnerCircle: View {
    @State var spinnerStart: CGFloat = 0.0
    @State var spinnerEnd: CGFloat = 0.0
    var color: Color = ColorPallete.highlightGreen
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
