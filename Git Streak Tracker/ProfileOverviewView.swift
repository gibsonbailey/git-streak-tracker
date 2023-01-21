//
//  ProfileOverviewView.swift
//  Git Streak Tracker
//
//  Created by Samuel Wood on 1/15/23.
//

import Foundation
import SwiftUI

//struct Provider: IntentTimelineProvider {
//
//}
struct ProfileOverviewView: View {
    
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
                        AsyncImage(url: URL(string: "https://avatars.githubusercontent.com/u/27198821?v=4"), scale: 2)
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
                            Text("16")
                                .font(.system(size: 90))
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .padding(.bottom, -20)
                            Text("DAYS")
                                .font(.system(size: 20))
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }
                        Spacer()
                    }

                    Spacer()

                    Group {
                        Text("John Smith")
                            .font(.system(size: 40))
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .padding(.bottom, -12)

                        Text("@username")
                            .font(.system(size: 25))
                            .foregroundColor(.white)
                            .opacity(0.3)
                    }
                    .frame(width: bounds.size.width, alignment: .leading)
                    .padding(.leading, 120)

                    Spacer()

                    Group {
                        Text("Contributions")
                            .font(.system(size: 25))
                            .foregroundColor(.white)
                        VStack(spacing: 0) {
                            ForEach(0..<7, id: \.self) { row in
                                HStack(spacing: 0) {
                                    ForEach(0..<20, id: \.self) { column in
                                        Rectangle()
                                            .fill(ColorPallete.midWhite)
                                            .frame(width: 12, height: 12)
                                            .cornerRadius(3)
                                    }.padding(1)
                                }
                            }
                            .padding(1)
                        }

                    }
                    .frame(width: bounds.size.width, alignment: .leading)
                    .padding(.leading, 120)
                    Spacer()
                }
                .frame(width: bounds.size.width, height: bounds.size.height/1.4)
//                .background(.gray)
            }
            .edgesIgnoringSafeArea(.all)
            .frame(width: bounds.size.width, height: bounds.size.height, alignment: .top)
            .background(Gradient(colors: [ColorPallete.darkerGreen, ColorPallete.darkGreen]))
        }
    }
}
    

struct ProfileOverviewView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileOverviewView()
    }
}
