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
        
        var githubUsername = loadGithubUsername() // gets username from GithubStore
        
        let contributionManager = ContributionManager()
        let contributions = contributionManager.getContributions(githubUsername)
        if  contributions.allContributions.count != 0 {
            // Generate a timeline consisting of five entries an hour apart, starting from the current date.
            let currentDate = Date()
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

struct Background : View {
    var entry: Provider.Entry
    
    var body: some View {
        ContainerRelativeShape()
            .fill(Gradient(colors: entry.todayComplete ? [
                ColorPallete.darkGreen,
                ColorPallete.midGreen
            ] : [
                ColorPallete.darkGray,
                ColorPallete.midGray
            ]))
    }
}

struct FlameImage : View {
    var entry: Provider.Entry
    
    var flameScale: Double = 0.85
    
    var opacity: Double = 1.0
    
    var x: Double = -15
    var y: Double = 135

    var body: some View {
        Image(entry.todayComplete ? "CopperFlame" : "GrayFlame")
            .resizable()
            .aspectRatio(contentMode: .fit)
            .padding([.leading], 100)
            .position(x: x, y: y)
            .opacity(opacity)
            .scaleEffect(
                x: flameScale,
                y: flameScale,
                anchor: .topLeading
            )
    }
}

struct MainStreakText : View {
    var entry: Provider.Entry
    
    var mainFontSize: Double = 70.0
    var subTextFontSize: Double = 12.0
    var paddingBottom: Double = -14.0
    
    var body: some View {
        VStack(alignment: .center) {
            Text(entry.days, format: .number)
                .font(.system(
                    size: mainFontSize,
                    weight: Font.Weight.semibold
                ))
                .padding(.bottom, paddingBottom)
                .foregroundColor(
                    entry.todayComplete ? .white : .gray
                )
            Text(entry.days == 1 ? "DAY" : "DAYS")
                .font(.system(
                    size: subTextFontSize,
                    weight: Font.Weight.semibold
                ))
                .foregroundColor(entry.todayComplete ? ColorPallete.midWhite : .gray
                )
        }
        .shadow(color: .black, radius: 5, x: -2, y: 2)
    }
}

struct Git_Streak_Tracker_Small_Widget_View : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack(alignment: .center) {
            Background(entry: entry)
            
            FlameImage(
                entry: entry,
                flameScale: 2.0,
                opacity: 0.75,
                x: -34,
                y: 45
            )


            MainStreakText(
                entry: entry,
                mainFontSize: entry.days < 100 ? 85.0 : 60,
                subTextFontSize: 18.0,
                paddingBottom: entry.days < 100 ? -22 : -16
            )
            
        }.frame(minWidth: 0, maxWidth: .infinity, alignment: .center)
        
    }
}

struct Git_Streak_Tracker_Medium_Widget_View : View {
    
    var entry: Provider.Entry
    
    let flameScale = 0.85

    var body: some View {
        ZStack(alignment: .topLeading) {
            Background(entry: entry)
            
            FlameImage(entry: entry)
           
            HStack {
                
                MainStreakText(entry: entry)
                
                Spacer()
                
                if (entry.todayComplete) {
                    GeometryReader { metrics in
                        HStack {
                            Spacer()
                            VStack(spacing: 8){
                                Text("Contrubtions")
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
                        .foregroundColor(ColorPallete.midWhite)
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
            Git_Streak_Tracker_Small_Widget_View(entry: entry)
                .environmentObject(UserStore(username: "", contributionData: ContributionData())) // I do this to make sure it updates with the app's state
        default:
            Git_Streak_Tracker_Medium_Widget_View(entry: entry)
                .environmentObject(UserStore(username: "", contributionData: ContributionData())) // I do this to make sure it updates with the app's state
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
            Git_Streak_Tracker_Medium_Widget_View(entry: StreakEntry(
                date: Date(),
                days: 15,
                todayComplete: true,
                latestContributions: [1, 1, 2, 2, 4, 5, 7],
                configuration: ConfigurationIntent()
            ))
            .previewContext(WidgetPreviewContext(family: .systemMedium))
            
            Git_Streak_Tracker_Small_Widget_View(entry: StreakEntry(
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
