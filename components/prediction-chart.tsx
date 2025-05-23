"use client"

import type React from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import type { PredictionData } from "@/lib/types"
import { getTeamColor } from "@/lib/team-colors"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface PredictionChartProps {
  predictions: PredictionData[]
  circuit: string
}

const PredictionChart: React.FC<PredictionChartProps> = ({ predictions, circuit }) => {
  // Sort predictions by position
  const sortedPredictions = [...predictions].sort((a, b) => a.position - b.position)

  // Extract gap values (convert from string to number)
  const gapValues = sortedPredictions.map((p) => {
    if (p.gap === "POLE") return 0
    return Number.parseFloat(p.gap.replace("+", "").replace("s", ""))
  })

  const chartData = {
    labels: sortedPredictions.map((p) => p.driver),
    datasets: [
      {
        label: "Gap to Pole (seconds)",
        data: gapValues,
        backgroundColor: sortedPredictions.map((p) => getTeamColor(p.team)),
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Predicted Gap to Pole - ${circuit} GP`,
        color: "white",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex
            const driver = sortedPredictions[index]
            return [`Driver: ${driver.driver}`, `Team: ${driver.team}`, `Gap: ${driver.gap}`, `Time: ${driver.time}`]
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
        title: {
          display: true,
          text: "Gap to Pole (seconds)",
          color: "white",
        },
      },
    },
  }

  return <Bar data={chartData} options={chartOptions} />
}

export default PredictionChart
