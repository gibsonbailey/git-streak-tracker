//
//  ProfileOverviewView.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/15/23.
//

import Foundation
import SwiftUI
import UIKit

func getMatrixValue(column: Int, row: Int) -> Int {
    // this tells us what index of the contibutions array cooresponds to the square located at <column>,<row>
    let number_of_rows = 7
    return (column * number_of_rows) + row
}

func getSquareColor(contributionData: ContributionData, column: Int, row: Int) -> (Color, Color) {
    let index = getMatrixValue(column: column, row:row)
    var count: Int = 0 // how many contributions exist on the day
    
    if index < contributionData.allContributions.count {
        count = contributionData.allContributions[index].contributionCount // set contributions for square
    }
    
    if contributionData.allContributions.count == 0 {
        // If not contributions exist atm
        return (ColorPallete.midGray, ColorPallete.lightGray)
    }
    else if index >= contributionData.allContributions.count - contributionData.streakLength{
        // streak zone
        return (ColorPallete.lightRed, ColorPallete.midRed)
    } else {
        // normal zone
       return (
        count > 0 ? ColorPallete.lighterGreen : ColorPallete.midGray,
        count > 0 ? ColorPallete.lightGreen : ColorPallete.lightGray
       )
   }
}

struct ContributionSquare: View {
    var column: Int
    var row: Int
    var contributionData: ContributionData
    var squareColor: Color
    var borderColor: Color

    init(column: Int, row: Int, contributionData: ContributionData) {
        self.column = column
        self.row = row
        self.contributionData = contributionData
        (squareColor, borderColor) = getSquareColor(contributionData: contributionData, column: column, row: row)
    }
    
    var body: some View {
        Rectangle()
            .fill(
                squareColor
            )
            .frame(width: 12, height: 12)
            .border(borderColor, width: 2)
            .cornerRadius(3)
    }
}

struct ProfileOverviewView: View {
    @EnvironmentObject private var userStore: UserStore
    
    var body: some View {
        GeometryReader { bounds in
            ZStack {
                HStack {
                    Image("OpaqueFlame")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        
                }
                .frame(width: bounds.size.width, height: bounds.size.height, alignment: .bottom)

                
            
                VStack {
                    Text("Github Streak Tracker")
                        .font(.system(size: 26))
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                    Spacer()
                    HStack {
                        Spacer()
                        AsyncImage(url: URL(string: userStore.contributionData.avatarUrl), scale: 2)
                            .frame(maxWidth: 111, maxHeight: 111)
                            .scaleEffect(
                                x: 0.5,
                                y: 0.5,
                                anchor: .center
                            )
                            .background(ColorPallete.darkGreen)
                            .cornerRadius(200)
                            .shadow(color: ColorPallete.highlightGreen, radius: 4, x: 0, y: 0)
                        Spacer()
                        VStack {
                            Text(String(userStore.contributionData.streakLength))
                                .font(.system(size: 90))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .padding(.bottom, -20)
                            Text(userStore.contributionData.streakLength != 1 ? "DAYS" : "DAY")
                                .font(.system(size: 20))
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }
                        Spacer()
                    }

                    Spacer()

                    Group {
                        Text(userStore.contributionData.name)
                            .font(.system(size: 40))
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .padding(.bottom, -8)

                        Text("@"+userStore.username)
                            .font(.system(size: 25))
                            .foregroundColor(.white)
                            .opacity(0.3)
                    }
                    .frame(width: bounds.size.width, alignment: .leading)
                    .padding(.leading, 120)

                    Spacer()

                    Group {
                        Text("Contributions" + String(userStore.contributionData.allContributions.count))
                            .font(.system(size: 25))
                            .foregroundColor(.white)
                        HStack(spacing: 0) {
                            ForEach(0..<18, id: \.self) { column in
                                VStack(spacing: 0) {
                                    ForEach(0..<7, id: \.self) { row in
                                        ContributionSquare(column: column, row: row, contributionData: userStore.contributionData)
                                    }.padding(0.8)
                                }
                            }
                            .padding(0.8)
                        }

                    }
                    .frame(width: bounds.size.width, alignment: .leading)
                    .padding(.leading, 120)
                    Spacer()
                }
                .frame(width: bounds.size.width, height: bounds.size.height/1.4)
            }
            .edgesIgnoringSafeArea(.all)
            .frame(width: bounds.size.width, height: bounds.size.height, alignment: .top)
            .background(Gradient(colors: [ColorPallete.darkerGreen, ColorPallete.darkGreen]))
        }
    }
}

struct ProfileOverviewView_Previews: PreviewProvider {
    static var previews: some View {
        return ProfileOverviewView()
            .environmentObject(UserStore(username: "", contributionData: ContributionData(
                streakLength: 10,
                allContributions: generateContributionDays(),
                name: "Sam Wood",
                avatarUrl: "https://avatars.githubusercontent.com/u/27198821?v=4"
            )))
    }
}


func generateContributionDays() -> [ContributionDay] {
    var contributionDays: [ContributionDay] = []
    for i in 0..<300 {
        let contributionCount = Int.random(in: 0...3)
        let weekday = i
        let date = "2022-01-0\(i+1)"
        let contributionDay = ContributionDay(contributionCount: contributionCount, weekday: weekday, date: date)
        contributionDays.append(contributionDay)
    }
    return contributionDays.suffix(126)
}
