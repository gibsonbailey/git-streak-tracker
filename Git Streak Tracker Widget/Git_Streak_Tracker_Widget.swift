//
//  Git_Streak_Tracker_Widget.swift
//  Git Streak Tracker Widget
//
//  Created by Bailey Lind-Trefts on 1/6/23.
//

import WidgetKit
import SwiftUI
import Intents

struct Provider: IntentTimelineProvider {
    
    func placeholder(in context: Context) -> StreakEntry {
        StreakEntry(
            date: Date(),
            days: 4,
            todayComplete: true,
            latestContributions: [1, 4, 2, 2, 4, 5, 7],
            configuration: ConfigurationIntent()
        )
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (StreakEntry) -> ()) {
        let entry = StreakEntry(
            date: Date(),
            days: 5,
            todayComplete: true,
            latestContributions: [1, 4, 2, 2, 4, 5, 7],
            configuration: configuration
        )
        completion(entry)
    }
    

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [StreakEntry] = []
        
        let storeURL = AppGroup.facts.containerURL.appendingPathComponent("githubUsername.txt")
        let manager = FileManager.default
        
        var githubUsername = ""
        if manager.fileExists(atPath: storeURL.path) {
            if let data = manager.contents(atPath: storeURL.path) {
                githubUsername = String(decoding: data, as: UTF8.self)
            }
        }
        
        let contributionManager = ContributionManager()
        if let contributions = contributionManager.getContributions(githubUsername) {
            // Generate a timeline consisting of five entries an hour apart, starting from the current date.
            let currentDate = Date()
            //        for hourOffset in 0 ..< 1 {
            //            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            //            let entry = StreakEntry(
            //                date: entryDate,
            //                days: hourOffset,
            //                todayComplete: false,
            //                configuration: configuration
            //            )
            //            entries.append(
            entries.append(StreakEntry(
                date: currentDate,
                days: contributions.streakLength,
                todayComplete: contributions.todayComplete,
                latestContributions: contributions.latestContributions,
                configuration: configuration
            ))
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct StreakEntry: TimelineEntry {
    let date: Date
    let days: Int
    let todayComplete: Bool
    let latestContributions: [Int]
    let configuration: ConfigurationIntent
}

struct ColorPallete {
    static let darkGreen = Color(
        red: 10.0 / 255.0,
        green: 22.0 / 255.0,
        blue: 0.0 / 255.0
    )
    static let midGreen = Color(
        red: 20.0 / 255.0,
        green: 40.0 / 255.0,
        blue: 0.0 / 255.0
    )

    static let darkGray = Color(
        red: 15.0 / 255.0,
        green: 15.0 / 255.0,
        blue: 15.0 / 255.0
    )
    static let midGray = Color(
        red: 25.0 / 255.0,
        green: 25.0 / 255.0,
        blue: 25.0 / 255.0
    )
}

struct Git_Streak_Tracker_Small_WidgetEntryView : View {
    var entry: Provider.Entry
    
    let flameScale = 2.0

    var body: some View {
        ZStack(alignment: .center) {
            ContainerRelativeShape()
                .fill(Gradient(colors: entry.todayComplete ? [
                    ColorPallete.darkGreen,
                    ColorPallete.midGreen
                ] : [
                    ColorPallete.darkGray,
                    ColorPallete.midGray
                ]))
            
            Image(entry.todayComplete ? "CopperFlame" : "GrayFlame")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .padding([.leading], 100)
                .position(x: -34, y: 45)
                .opacity(0.75)
                .scaleEffect(
                    x: flameScale,
                    y: flameScale,
                    anchor: .topLeading
                )

            VStack(alignment: .center) {
                Text(entry.days, format: .number)
                    .font(.system(
                        size: entry.days < 100 ? 85.0 : 60,
                        weight: Font.Weight.semibold
                    ))
                    .padding(.bottom, entry.days < 100 ? -22 : -16)
                    .foregroundColor(
                        entry.todayComplete ? .white : .gray
                    )
                Text(entry.days == 1 ? "DAY" : "DAYS")
                    .font(.system(
                        size: 18.0,
                        weight: Font.Weight.semibold
                    ))
                    .foregroundColor(entry.todayComplete ? Color(
                            red: 218.0 / 255.0,
                            green: 218.0 / 255.0,
                            blue: 218.0 / 255.0
                        ) : .gray
                    )
            }
            .shadow(color: .black, radius: 5, x: -2, y: 2)
            .frame(minWidth: 0, maxWidth: .infinity, alignment: .center)
        }.frame(minWidth: 0, maxWidth: .infinity, alignment: .center)
        
    }
}

struct Git_Streak_Tracker_Medium_WidgetEntryView : View {
    var entry: Provider.Entry
    
    let flameScale = 0.85

    var body: some View {
        ZStack(alignment: .topLeading) {
            ContainerRelativeShape()
                .fill(Gradient(colors: entry.todayComplete ? [
                    ColorPallete.darkGreen,
                    ColorPallete.midGreen
                ] : [
                    ColorPallete.darkGray,
                    ColorPallete.midGray
                ]))
            
            Image(entry.todayComplete ? "CopperFlame" : "GrayFlame")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .padding([.leading], 100)
                .position(x: -15, y: 135)
                .scaleEffect(
                    x: flameScale,
                    y: flameScale,
                    anchor: .topLeading
                )
            
            HStack {
                VStack {
                    Text(entry.days, format: .number)
                        .font(.system(
                            size: 70.0,
                            weight: Font.Weight.semibold
                        ))
                        .padding(.bottom, -14.0)
                        .foregroundColor(
                            entry.todayComplete ? .white : .gray
                        )
                    Text(entry.days == 1 ? "DAY" : "DAYS")
                        .font(.system(
                            size: 12.0,
                            weight: Font.Weight.semibold
                        ))
                        .foregroundColor(entry.todayComplete ? Color(
                                red: 218.0 / 255.0,
                                green: 218.0 / 255.0,
                                blue: 218.0 / 255.0
                            ) : .gray
                        )
                }
                .shadow(color: .black, radius: 5, x: -2, y: 2)
                
                Spacer()
                
                if (entry.todayComplete) {
                    GeometryReader { metrics in
                        HStack {
                            Spacer()
                            VStack(spacing: 8){
                                Text("Contributions")
                                    .foregroundColor(.white)
                                    .fontWeight(.semibold)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    
                                GraphPath(data: entry.latestContributions)
                                    .padding(.top, 0.0)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                HStack {
                                    Text("Mon")
                                    Spacer()
                                    Text("Wed")
                                    Spacer()
                                    Text("Sat")
                                }
                                .foregroundColor(.white)
                                .font(.system(size: 10))
                                .frame(maxWidth: .infinity)
                            }
                            .frame(width: metrics.size.width * 0.75)
                        }
                        .padding(.top, 13)
                        
                    }
                    .frame(alignment: .trailing)
                    
                    
                } else {
                    Text("No contribution today")
                        .font(.subheadline)
                        .foregroundColor(Color(
                            red: 218.0 / 255.0,
                            green: 218.0 / 255.0,
                            blue: 218.0 / 255.0
                        ))
                }
            }
            .padding(50)

        }.frame(alignment: .topLeading)
        
    }
}

struct Git_Streak_Tracker_WidgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    @ViewBuilder
    var body: some View {
        
        switch family {
        case .systemSmall:
            Git_Streak_Tracker_Small_WidgetEntryView(entry: entry)
        default:
            Git_Streak_Tracker_Medium_WidgetEntryView(entry: entry)
        }

    }
}

struct Git_Streak_Tracker_Widget: Widget {
    let kind: String = "Git_Streak_Tracker_Widget"

    var body: some WidgetConfiguration {
        IntentConfiguration(
            kind: kind,
            intent: ConfigurationIntent.self,
            provider: Provider()
        ) {
            entry in Git_Streak_Tracker_WidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Git Streak Widget")
        .description("This is an example widget.")
        .supportedFamilies([.systemMedium, .systemSmall])
    }
}

struct Git_Streak_Tracker_Widget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Git_Streak_Tracker_Medium_WidgetEntryView(entry: StreakEntry(
                date: Date(),
                days: 15,
                todayComplete: true,
                latestContributions: [1, 1, 2, 2, 4, 5, 7],
                configuration: ConfigurationIntent()
            ))
            .previewContext(WidgetPreviewContext(family: .systemMedium))
            
            Git_Streak_Tracker_Small_WidgetEntryView(entry: StreakEntry(
                date: Date(),
                days: 350,
                todayComplete: true,
                latestContributions: [1, 1, 2, 2, 4, 5, 7],
                configuration: ConfigurationIntent()
            ))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
        }
    }
}
