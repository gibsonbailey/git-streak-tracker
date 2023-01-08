//
//  GraphPath.swift
//  Git Streak Tracker WidgetExtension
//
//  Created by Bailey Lind-Trefts on 1/7/23.
//

import Foundation
import SwiftUI

struct GraphPath: View {
    let data: [Int]
    
    func getDataMax() -> Int {
        guard let max = data.max() else {
            return 1
        }
        return max
    }
    
    var body: some View {
        
        let frameHeight = 35.0
        let frameWidth = 120.0
        let dataMax = getDataMax()
        
        let scaleX = frameWidth / Double(data.count - 1)
        let scaleY: Double = frameHeight / Double(dataMax - 1)
        
        let brightGreen = Color(
            red: 5.0 / 255.0,
            green: 255.0 / 255.0,
            blue: 0.0 / 255.0
        )
        let fadedBrightGreen = Color(
            red: 5.0 / 255.0,
            green: 255.0 / 255.0,
            blue: 0.0 / 255.0,
            opacity: 0.5
        )
        
        let baseX = 0
        let baseY = Int(frameHeight)
        
        Path { path in
            path.move(to: CGPoint(
                x: baseX,
                y: baseY - Int(scaleY * Double(data[0]) * 0.5)
            ))
            data.enumerated().forEach { (index, point) in
                path.addLine(to: CGPoint(
                    x: baseX + Int(scaleX * Double(index)),
                    y: baseY - Int(scaleY * Double(point) * 0.5)
                ))
            }
        }
        .stroke(brightGreen, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))
        .shadow(color: fadedBrightGreen, radius: 4, y: 8)
    }
}

struct GraphPath_Previews: PreviewProvider {
    static var previews: some View {
        GraphPath(data: [1, 4, 2, 2, 5, 2, 1])
    }
}
