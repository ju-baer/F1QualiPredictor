export interface PredictionData {
  position: number
  driver: string
  team: string
  time: string
  gap: string
  rawTime?: number
}

export interface PredictionOptions {
  modelType: string
  mlModel: string
  usePerformance: boolean
  mlWeight: number
  weather: string
}

export interface HistoricalData {
  summary: {
    sessions: number
    drivers: number
    teams: number
  }
  circuitData: Array<{
    name: string
    averageTime: number
  }>
  driverData: Array<{
    name: string
    team: string
    averageTime: number
  }>
  teamData: Array<{
    name: string
    averageTime: number
  }>
}

export interface ModelPerformanceData {
  metrics: {
    mae: number
    rmse: number
    r2: number
  }
  cv: {
    mae_mean: number
    mae_std: number
    r2_mean: number
    r2_std: number
  }
  predictions: Array<{
    driver: string
    circuit: string
    actual: number
    predicted: number
  }>
}
