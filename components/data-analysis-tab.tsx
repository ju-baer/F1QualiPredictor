"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchHistoricalData, fetchModelPerformance } from "@/lib/mock-data"
import dynamic from "next/dynamic"

// Dynamically import chart components to avoid SSR issues
const HistoricalDataChart = dynamic(() => import("./historical-data-chart"), { ssr: false })
const ModelPerformanceChart = dynamic(() => import("./model-performance-chart"), { ssr: false })

const DataAnalysisTab = () => {
  const [historicalData, setHistoricalData] = useState(null)
  const [modelPerformance, setModelPerformance] = useState(null)
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false)
  const [isLoadingModel, setIsLoadingModel] = useState(false)

  const handleFetchHistoricalData = () => {
    setIsLoadingHistorical(true)

    // Simulate API call delay
    setTimeout(() => {
      const data = fetchHistoricalData()
      setHistoricalData(data)
      setIsLoadingHistorical(false)
    }, 1500)
  }

  const handleTrainModel = () => {
    setIsLoadingModel(true)

    // Simulate API call delay
    setTimeout(() => {
      const data = fetchModelPerformance()
      setModelPerformance(data)
      setIsLoadingModel(false)
    }, 2000)
  }

  return (
    <div>
      <Card className="f1-card mb-6">
        <h2 className="text-xl font-bold mb-2 text-white">Data Analysis</h2>
        <p className="text-gray-400 mb-4">Explore historical qualifying data and model performance</p>

        <Tabs defaultValue="historical">
          <TabsList className="mb-4">
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
            <TabsTrigger value="model">Model Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="historical">
            <Card className="bg-[#38383F] p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold text-white mb-4">Historical Qualifying Data</h3>

              {!historicalData ? (
                <>
                  <div className="bg-[#1E1E1E] p-6 rounded-lg text-center mb-4">
                    <h4 className="text-white font-bold mb-2">Click "Fetch Historical Data" to load qualifying data</h4>
                    <p className="text-gray-400 mb-4">This will fetch qualifying data from recent F1 seasons</p>
                    <Button className="f1-red" onClick={handleFetchHistoricalData} disabled={isLoadingHistorical}>
                      {isLoadingHistorical ? "Fetching Data..." : "Fetch Historical Data"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-[#1E1E1E] p-4 rounded-lg text-center">
                      <h1 className="text-[#E10600] text-3xl font-bold">{historicalData.summary.sessions}</h1>
                      <p className="text-white">Qualifying Sessions</p>
                    </Card>

                    <Card className="bg-[#1E1E1E] p-4 rounded-lg text-center">
                      <h1 className="text-[#E10600] text-3xl font-bold">{historicalData.summary.drivers}</h1>
                      <p className="text-white">Drivers</p>
                    </Card>

                    <Card className="bg-[#1E1E1E] p-4 rounded-lg text-center">
                      <h1 className="text-[#E10600] text-3xl font-bold">{historicalData.summary.teams}</h1>
                      <p className="text-white">Teams</p>
                    </Card>
                  </div>

                  <Tabs defaultValue="circuit">
                    <TabsList className="mb-4">
                      <TabsTrigger value="circuit">By Circuit</TabsTrigger>
                      <TabsTrigger value="driver">By Driver</TabsTrigger>
                      <TabsTrigger value="team">By Team</TabsTrigger>
                    </TabsList>

                    <TabsContent value="circuit">
                      <Card className="bg-[#1E1E1E] p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-4">Circuit Performance</h4>
                        <div className="h-[400px]">
                          <HistoricalDataChart data={historicalData.circuitData} type="circuit" />
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="driver">
                      <Card className="bg-[#1E1E1E] p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-4">Driver Performance</h4>
                        <div className="h-[400px]">
                          <HistoricalDataChart data={historicalData.driverData} type="driver" />
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="team">
                      <Card className="bg-[#1E1E1E] p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-4">Team Performance</h4>
                        <div className="h-[400px]">
                          <HistoricalDataChart data={historicalData.teamData} type="team" />
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="model">
            <Card className="bg-[#38383F] p-4 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">Model Performance</h3>

              {!modelPerformance ? (
                <div className="bg-[#1E1E1E] p-6 rounded-lg text-center mb-4">
                  <h4 className="text-white font-bold mb-2">
                    Click "Train and Evaluate Model" to analyze model performance
                  </h4>
                  <p className="text-gray-400 mb-4">This will train a model and evaluate its performance</p>
                  <Button className="f1-red" onClick={handleTrainModel} disabled={isLoadingModel}>
                    {isLoadingModel ? "Training Model..." : "Train and Evaluate Model"}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-[#1E1E1E] border-l-4 border-[#E10600] p-4 rounded-lg text-center">
                      <h1 className="text-[#E10600] text-3xl font-bold">{modelPerformance.metrics.mae}s</h1>
                      <p className="text-white">Mean Absolute Error</p>
                    </Card>

                    <Card className="bg-[#1E1E1E] border-l-4 border-[#E10600] p-4 rounded-lg text-center">
                      <h1 className="text-[#E10600] text-3xl font-bold">{modelPerformance.metrics.rmse}s</h1>
                      <p className="text-white">Root Mean Squared Error</p>
                    </Card>

                    <Card className="bg-[#1E1E1E] border-l-4 border-[#E10600] p-4 rounded-lg text-center">
                      <h1 className="text-[#E10600] text-3xl font-bold">{modelPerformance.metrics.r2}</h1>
                      <p className="text-white">R² Score</p>
                    </Card>
                  </div>

                  <Card className="bg-[#1E1E1E] p-4 rounded-lg mb-6">
                    <h4 className="text-white font-bold mb-4">Cross-Validation Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-[#1E1E1E] border-l-4 border-[#0090FF] p-4 rounded-lg text-center">
                        <h1 className="text-[#0090FF] text-2xl font-bold">
                          {modelPerformance.cv.mae_mean}s ± {modelPerformance.cv.mae_std}
                        </h1>
                        <p className="text-white">CV Mean Absolute Error</p>
                      </Card>

                      <Card className="bg-[#1E1E1E] border-l-4 border-[#0090FF] p-4 rounded-lg text-center">
                        <h1 className="text-[#0090FF] text-2xl font-bold">
                          {modelPerformance.cv.r2_mean} ± {modelPerformance.cv.r2_std}
                        </h1>
                        <p className="text-white">CV R² Score</p>
                      </Card>
                    </div>
                  </Card>

                  <Card className="bg-[#1E1E1E] p-4 rounded-lg">
                    <h4 className="text-white font-bold mb-4">Prediction Analysis</h4>
                    <div className="h-[400px]">
                      <ModelPerformanceChart data={modelPerformance.predictions} />
                    </div>
                  </Card>
                </>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default DataAnalysisTab
