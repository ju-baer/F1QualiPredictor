import type React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PredictionData } from "@/lib/types"
import dynamic from "next/dynamic"

// Dynamically import chart components to avoid SSR issues
const PredictionChart = dynamic(() => import("./prediction-chart"), { ssr: false })
const TrackVisualization = dynamic(() => import("./track-visualization"), { ssr: false })

interface PredictionResultsProps {
  predictions: PredictionData[]
  circuit: string
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ predictions, circuit }) => {
  // Sort predictions by position
  const sortedPredictions = [...predictions].sort((a, b) => a.position - b.position)
  const top3 = sortedPredictions.slice(0, 3)

  return (
    <div>
      <div className="bg-[#E10600] p-4 rounded-md text-center mb-6">
        <h2 className="text-xl font-bold text-white">{circuit} Grand Prix Qualifying Prediction</h2>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {top3.map((driver, index) => {
          const position = index + 1
          const positionClass = position === 1 ? "position-p1" : position === 2 ? "position-p2" : "position-p3"
          const medalColor = position === 1 ? "bg-yellow-400" : position === 2 ? "bg-gray-300" : "bg-amber-700"
          const teamColorClass = `team-color-${driver.team.toLowerCase().replace(/\s+/g, "")}`

          return (
            <Card key={driver.driver} className={`bg-[#38383F] p-4 rounded-lg text-center ${positionClass}`}>
              <div
                className={`${medalColor} text-black w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg`}
              >
                P{position}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{driver.driver}</h3>
              <div className={`${teamColorClass} py-1 px-2 rounded my-2`}>{driver.team}</div>
              <p className="text-xl font-bold">{driver.time}</p>
              <p className={position === 1 ? "text-yellow-400 font-bold" : "text-gray-300"}>{driver.gap}</p>
            </Card>
          )
        })}
      </div>

      {/* Full Grid */}
      <Card className="bg-[#38383F] p-4 rounded-lg mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Full Grid</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E10600] text-white">
                <th className="p-2 text-center">Position</th>
                <th className="p-2 text-left">Driver</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2 text-center">Predicted Time</th>
                <th className="p-2 text-center">Gap to Pole</th>
              </tr>
            </thead>
            <tbody>
              {sortedPredictions.map((driver, index) => {
                const position = driver.position
                const teamColor = `team-color-${driver.team.toLowerCase().replace(/\s+/g, "")}`

                // Row background based on position
                let bgColor = ""
                if (position === 1) bgColor = "bg-yellow-400/10"
                else if (position === 2) bgColor = "bg-gray-300/10"
                else if (position === 3) bgColor = "bg-amber-700/10"
                else bgColor = position % 2 === 0 ? "bg-[#38383F]/70" : "bg-[#38383F]/50"

                return (
                  <tr key={driver.driver} className={bgColor}>
                    <td className="p-2 text-center font-bold">{position}</td>
                    <td className="p-2 text-left">
                      <div className="flex items-center">
                        <div className={`w-1 h-5 ${teamColor} mr-2`}></div>
                        {driver.driver}
                      </div>
                    </td>
                    <td className="p-2 text-left">{driver.team}</td>
                    <td className="p-2 text-center font-bold">{driver.time}</td>
                    <td className={`p-2 text-center ${position === 1 ? "text-yellow-400 font-bold" : ""}`}>
                      {driver.gap}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visualizations */}
      <Card className="bg-[#38383F] p-4 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-4">Visualization</h3>

        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Gap Chart</TabsTrigger>
            <TabsTrigger value="track">Track Position</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <div className="h-[400px]">
              <PredictionChart predictions={predictions} circuit={circuit} />
            </div>
          </TabsContent>

          <TabsContent value="track">
            <div className="h-[400px]">
              <TrackVisualization predictions={predictions} circuit={circuit} />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default PredictionResults
