import type { PredictionData, PredictionOptions, HistoricalData, ModelPerformanceData } from "./types"

// Mock driver data
const DRIVERS = [
  { name: "Max Verstappen", team: "Red Bull Racing" },
  { name: "Sergio Perez", team: "Red Bull Racing" },
  { name: "Charles Leclerc", team: "Ferrari" },
  { name: "Carlos Sainz", team: "Ferrari" },
  { name: "Lewis Hamilton", team: "Mercedes" },
  { name: "George Russell", team: "Mercedes" },
  { name: "Lando Norris", team: "McLaren" },
  { name: "Oscar Piastri", team: "McLaren" },
  { name: "Fernando Alonso", team: "Aston Martin" },
  { name: "Lance Stroll", team: "Aston Martin" },
  { name: "Daniel Ricciardo", team: "RB" },
  { name: "Yuki Tsunoda", team: "RB" },
  { name: "Alex Albon", team: "Williams" },
  { name: "Logan Sargeant", team: "Williams" },
  { name: "Kevin Magnussen", team: "Haas F1 Team" },
  { name: "Nico Hulkenberg", team: "Haas F1 Team" },
  { name: "Valtteri Bottas", team: "Kick Sauber" },
  { name: "Zhou Guanyu", team: "Kick Sauber" },
  { name: "Esteban Ocon", team: "Alpine" },
  { name: "Pierre Gasly", team: "Alpine" },
]

// Circuit base times (in seconds)
const CIRCUIT_BASE_TIMES: Record<string, number> = {
  Bahrain: 90.5,
  "Saudi Arabia": 88.2,
  Australia: 79.8,
  Japan: 92.3,
  China: 94.1,
  Miami: 87.5,
  "Emilia Romagna": 76.2,
  Monaco: 72.5,
  Canada: 74.8,
  Spain: 81.3,
  Austria: 64.2,
  "Great Britain": 85.7,
  Hungary: 76.5,
  Belgium: 106.2,
  Netherlands: 71.3,
  Italy: 80.4,
  Azerbaijan: 102.8,
  Singapore: 101.5,
  "United States": 93.7,
  Mexico: 77.8,
  Brazil: 71.2,
  "Las Vegas": 95.6,
  Qatar: 82.9,
  "Abu Dhabi": 84.1,
}

// Team performance factors
const TEAM_FACTORS: Record<string, number> = {
  "Red Bull Racing": 0.98,
  Ferrari: 0.99,
  Mercedes: 1.0,
  McLaren: 0.99,
  "Aston Martin": 1.02,
  RB: 1.03,
  Williams: 1.04,
  "Haas F1 Team": 1.05,
  "Kick Sauber": 1.06,
  Alpine: 1.04,
}

// Driver performance factors
const DRIVER_FACTORS: Record<string, number> = {
  "Max Verstappen": 0.97,
  "Charles Leclerc": 0.98,
  "Lewis Hamilton": 0.98,
  "Lando Norris": 0.98,
  "Fernando Alonso": 0.99,
  "George Russell": 0.99,
  "Carlos Sainz": 0.99,
  "Oscar Piastri": 1.0,
  "Sergio Perez": 1.01,
  "Daniel Ricciardo": 1.02,
  "Alex Albon": 1.02,
  "Yuki Tsunoda": 1.03,
  "Lance Stroll": 1.03,
  "Nico Hulkenberg": 1.03,
  "Esteban Ocon": 1.04,
  "Pierre Gasly": 1.04,
  "Kevin Magnussen": 1.04,
  "Valtteri Bottas": 1.05,
  "Zhou Guanyu": 1.06,
  "Logan Sargeant": 1.07,
}

// Weather factors
const WEATHER_FACTORS: Record<string, number> = {
  dry: 1.0,
  damp: 1.05,
  wet: 1.12,
}

// Generate mock predictions
export function generatePredictions(circuit: string, options: PredictionOptions): PredictionData[] {
  const baseTime = CIRCUIT_BASE_TIMES[circuit] || 90.0
  const weatherFactor = WEATHER_FACTORS[options.weather] || 1.0

  // Generate raw times for each driver
  const predictions = DRIVERS.map((driver) => {
    const teamFactor = TEAM_FACTORS[driver.team] || 1.0
    const driverFactor = DRIVER_FACTORS[driver.name] || 1.0

    // Add some randomness
    const randomFactor = 0.995 + Math.random() * 0.02

    // Calculate raw time based on model type
    let rawTime
    if (options.modelType === "performance") {
      // Performance factors only
      rawTime = baseTime * teamFactor * driverFactor * weatherFactor * randomFactor
    } else if (options.modelType === "ml") {
      // ML only (with some randomness to simulate ML prediction)
      rawTime = baseTime * weatherFactor * randomFactor
    } else {
      // Hybrid approach
      const mlPrediction = baseTime * weatherFactor * randomFactor
      const performancePrediction = baseTime * teamFactor * driverFactor * weatherFactor * randomFactor
      rawTime = mlPrediction * options.mlWeight + performancePrediction * (1 - options.mlWeight)
    }

    return {
      driver: driver.name,
      team: driver.team,
      rawTime,
    }
  })

  // Sort by raw time
  predictions.sort((a, b) => a.rawTime - b.rawTime)

  // Format the predictions
  const poleTime = predictions[0].rawTime

  return predictions.map((pred, index) => {
    const position = index + 1
    const minutes = Math.floor(pred.rawTime / 60)
    const seconds = (pred.rawTime % 60).toFixed(3)
    const time = `${minutes}:${seconds.padStart(6, "0")}`

    const gap = position === 1 ? "POLE" : `+${(pred.rawTime - poleTime).toFixed(3)}s`

    return {
      position,
      driver: pred.driver,
      team: pred.team,
      time,
      gap,
      rawTime: pred.rawTime,
    }
  })
}

// Generate mock historical data
export function fetchHistoricalData(): HistoricalData {
  return {
    summary: {
      sessions: 24,
      drivers: 20,
      teams: 10,
    },
    circuitData: [
      { name: "Monaco", averageTime: 72.5 },
      { name: "Austria", averageTime: 64.2 },
      { name: "Brazil", averageTime: 71.2 },
      { name: "Netherlands", averageTime: 71.3 },
      { name: "Hungary", averageTime: 76.5 },
      { name: "Emilia Romagna", averageTime: 76.2 },
      { name: "Mexico", averageTime: 77.8 },
      { name: "Australia", averageTime: 79.8 },
      { name: "Italy", averageTime: 80.4 },
      { name: "Spain", averageTime: 81.3 },
      { name: "Qatar", averageTime: 82.9 },
      { name: "Abu Dhabi", averageTime: 84.1 },
      { name: "Great Britain", averageTime: 85.7 },
      { name: "Miami", averageTime: 87.5 },
      { name: "Saudi Arabia", averageTime: 88.2 },
      { name: "Bahrain", averageTime: 90.5 },
      { name: "Japan", averageTime: 92.3 },
      { name: "United States", averageTime: 93.7 },
      { name: "China", averageTime: 94.1 },
      { name: "Las Vegas", averageTime: 95.6 },
      { name: "Singapore", averageTime: 101.5 },
      { name: "Azerbaijan", averageTime: 102.8 },
      { name: "Belgium", averageTime: 106.2 },
    ],
    driverData: [
      { name: "Max Verstappen", team: "Red Bull Racing", averageTime: 87.2 },
      { name: "Charles Leclerc", team: "Ferrari", averageTime: 87.5 },
      { name: "Lewis Hamilton", team: "Mercedes", averageTime: 87.6 },
      { name: "Lando Norris", team: "McLaren", averageTime: 87.7 },
      { name: "George Russell", team: "Mercedes", averageTime: 87.9 },
      { name: "Carlos Sainz", team: "Ferrari", averageTime: 88.0 },
      { name: "Fernando Alonso", team: "Aston Martin", averageTime: 88.2 },
      { name: "Oscar Piastri", team: "McLaren", averageTime: 88.3 },
      { name: "Sergio Perez", team: "Red Bull Racing", averageTime: 88.5 },
      { name: "Daniel Ricciardo", team: "RB", averageTime: 89.1 },
      { name: "Alex Albon", team: "Williams", averageTime: 89.3 },
      { name: "Lance Stroll", team: "Aston Martin", averageTime: 89.5 },
      { name: "Yuki Tsunoda", team: "RB", averageTime: 89.6 },
      { name: "Nico Hulkenberg", team: "Haas F1 Team", averageTime: 89.7 },
      { name: "Esteban Ocon", team: "Alpine", averageTime: 89.8 },
      { name: "Pierre Gasly", team: "Alpine", averageTime: 89.9 },
      { name: "Kevin Magnussen", team: "Haas F1 Team", averageTime: 90.1 },
      { name: "Valtteri Bottas", team: "Kick Sauber", averageTime: 90.3 },
      { name: "Zhou Guanyu", team: "Kick Sauber", averageTime: 90.7 },
      { name: "Logan Sargeant", team: "Williams", averageTime: 91.0 },
    ],
    teamData: [
      { name: "Red Bull Racing", averageTime: 87.8 },
      { name: "Ferrari", averageTime: 87.9 },
      { name: "Mercedes", averageTime: 88.0 },
      { name: "McLaren", averageTime: 88.1 },
      { name: "Aston Martin", averageTime: 88.9 },
      { name: "RB", averageTime: 89.4 },
      { name: "Williams", averageTime: 90.2 },
      { name: "Haas F1 Team", averageTime: 90.0 },
      { name: "Alpine", averageTime: 89.9 },
      { name: "Kick Sauber", averageTime: 90.5 },
    ],
  }
}

// Generate mock model performance data
export function fetchModelPerformance(): ModelPerformanceData {
  return {
    metrics: {
      mae: 0.342,
      rmse: 0.487,
      r2: 0.876,
    },
    cv: {
      mae_mean: 0.356,
      mae_std: 0.042,
      r2_mean: 0.862,
      r2_std: 0.031,
    },
    predictions: [
      { driver: "Max Verstappen", circuit: "Japan", actual: 92.123, predicted: 92.245 },
      { driver: "Charles Leclerc", circuit: "Japan", actual: 92.345, predicted: 92.187 },
      { driver: "Lewis Hamilton", circuit: "Japan", actual: 92.567, predicted: 92.789 },
      { driver: "Lando Norris", circuit: "Japan", actual: 92.678, predicted: 92.456 },
      { driver: "George Russell", circuit: "Japan", actual: 92.789, predicted: 93.012 },
      { driver: "Carlos Sainz", circuit: "Japan", actual: 92.89, predicted: 92.567 },
      { driver: "Fernando Alonso", circuit: "Japan", actual: 93.123, predicted: 93.345 },
      { driver: "Oscar Piastri", circuit: "Japan", actual: 93.234, predicted: 93.456 },
      { driver: "Sergio Perez", circuit: "Japan", actual: 93.456, predicted: 93.234 },
      { driver: "Daniel Ricciardo", circuit: "Japan", actual: 93.789, predicted: 94.012 },
      { driver: "Max Verstappen", circuit: "Bahrain", actual: 90.234, predicted: 90.123 },
      { driver: "Charles Leclerc", circuit: "Bahrain", actual: 90.456, predicted: 90.678 },
      { driver: "Lewis Hamilton", circuit: "Bahrain", actual: 90.567, predicted: 90.345 },
      { driver: "Lando Norris", circuit: "Bahrain", actual: 90.789, predicted: 91.012 },
      { driver: "George Russell", circuit: "Bahrain", actual: 90.89, predicted: 90.567 },
      { driver: "Carlos Sainz", circuit: "Bahrain", actual: 91.123, predicted: 91.345 },
      { driver: "Fernando Alonso", circuit: "Bahrain", actual: 91.234, predicted: 91.456 },
      { driver: "Oscar Piastri", circuit: "Bahrain", actual: 91.456, predicted: 91.234 },
      { driver: "Sergio Perez", circuit: "Bahrain", actual: 91.567, predicted: 91.789 },
      { driver: "Daniel Ricciardo", circuit: "Bahrain", actual: 91.89, predicted: 92.123 },
    ],
  }
}
