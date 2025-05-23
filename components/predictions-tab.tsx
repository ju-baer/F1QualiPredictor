"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { generatePredictions } from "@/lib/mock-data"
import PredictionResults from "./prediction-results"
import { CircuitSelector } from "./circuit-selector"

const PredictionsTab = () => {
  const [selectedCircuit, setSelectedCircuit] = useState("Japan")
  const [modelType, setModelType] = useState("hybrid")
  const [mlModel, setMlModel] = useState("linear")
  const [usePerformance, setUsePerformance] = useState(true)
  const [mlWeight, setMlWeight] = useState(70)
  const [weather, setWeather] = useState("dry")
  const [predictions, setPredictions] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGeneratePredictions = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const results = generatePredictions(selectedCircuit, {
        modelType,
        mlModel,
        usePerformance,
        mlWeight: mlWeight / 100,
        weather,
      })
      setPredictions(results)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar / Controls */}
      <div className="md:col-span-1 space-y-6">
        <Card className="f1-card">
          <h2 className="text-xl font-bold mb-4 text-white">Control Panel</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Circuit</h3>
              <CircuitSelector value={selectedCircuit} onValueChange={setSelectedCircuit} />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Model Settings</h3>
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hybrid">Hybrid (ML + Performance)</SelectItem>
                  <SelectItem value="ml">ML Only</SelectItem>
                  <SelectItem value="performance">Performance Factors Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">ML Algorithm</h3>
              <Select value={mlModel} onValueChange={setMlModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ML algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="ridge">Ridge Regression</SelectItem>
                  <SelectItem value="rf">Random Forest</SelectItem>
                  <SelectItem value="gbm">Gradient Boosting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Performance Factors</h3>
              <div className="flex items-center space-x-2 mb-4">
                <Switch checked={usePerformance} onCheckedChange={setUsePerformance} id="use-performance" />
                <Label htmlFor="use-performance">Use Performance Factors</Label>
              </div>

              {usePerformance && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">ML Weight</span>
                    <span className="text-sm text-gray-400">{mlWeight}%</span>
                  </div>
                  <Slider
                    value={[mlWeight]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(value) => setMlWeight(value[0])}
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">Track Conditions</h3>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry">Dry ☀️</SelectItem>
                  <SelectItem value="damp">Damp 🌦️</SelectItem>
                  <SelectItem value="wet">Wet 🌧️</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full f1-red" onClick={handleGeneratePredictions} disabled={isLoading}>
              {isLoading ? "Generating..." : "GENERATE PREDICTIONS"}
            </Button>
          </div>
        </Card>

        <Card className="f1-card">
          <h3 className="text-lg font-bold mb-2 text-white">Current Settings</h3>
          <ul className="text-gray-300 space-y-1">
            <li>Circuit: {selectedCircuit}</li>
            <li>Model: {modelType === "hybrid" ? "Hybrid" : modelType === "ml" ? "ML Only" : "Performance Only"}</li>
            <li>
              Algorithm:{" "}
              {mlModel === "linear"
                ? "Linear Regression"
                : mlModel === "ridge"
                  ? "Ridge Regression"
                  : mlModel === "rf"
                    ? "Random Forest"
                    : "Gradient Boosting"}
            </li>
            <li>Weather: {weather.charAt(0).toUpperCase() + weather.slice(1)}</li>
          </ul>
        </Card>
      </div>

      {/* Main Content */}
      <div className="md:col-span-2">
        <Card className="f1-card mb-6">
          <h2 className="text-xl font-bold mb-2 text-white">Qualifying Predictions</h2>
          <p className="text-gray-400 mb-4">Predict Q3 qualifying results for the {selectedCircuit} Grand Prix</p>

          {predictions ? (
            <PredictionResults predictions={predictions} circuit={selectedCircuit} />
          ) : (
            <div className="bg-[#38383F] rounded-lg p-8 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ready to predict qualifying results?</h3>
              <p className="text-gray-400 mb-6">
                Select a circuit and model settings, then click "GENERATE PREDICTIONS"
              </p>
              <div className="f1-header inline-block">Waiting for input...</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default PredictionsTab
