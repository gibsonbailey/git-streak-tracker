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
        GeometryReader { metrics in
            let frameHeight = 20.0
            let frameWidth = metrics.size.width
            let dataMax = getDataMax()
            
            let scaleX = frameWidth / Double(data.count - 1)
            let scaleY: Double = frameHeight / Double(dataMax - 1)
            
            let brightGreen = ColorPallete.highlightGreen
            let fadedBrightGreen = ColorPallete.highlightGreen.opacity(0.5)
 
            let baseX = 0
            let baseY = Int(frameHeight) + 8
            
            VStack {
                Path { path in
                    path.move(to: CGPoint(
                        x: baseX,
                        y: baseY - Int(scaleY * Double(data[0]))
                    ))
                    data.enumerated().forEach { (index, point) in
                        path.addLine(to: CGPoint(
                            x: baseX + Int(scaleX * Double(index)),
                            y: baseY - Int(scaleY * Double(point))
                        ))
                    }
                }
                .stroke(brightGreen, style: StrokeStyle(lineWidth: 1, lineCap: .round, lineJoin: .round))
                .shadow(color: fadedBrightGreen, radius: 4, y: 8)
            }
            .frame(width: frameWidth, height: frameHeight)
        }
        
        
        
    }
}

struct GraphPath_Previews: PreviewProvider {
    static var previews: some View {
        GraphPath(data: [1, 1, 2, 2, 5, 2, 1])
    }
}
