"use client"

import type React from "react"
import { Scatter } from "react-chartjs-2"
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

interface ModelPerformanceChartProps {
  data: any[]
}

const ModelPerformanceChart: React.FC<ModelPerformanceChartProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: "Actual vs Predicted",
        data: data.map((item) => ({
          x: item.actual,
          y: item.predicted,
        })),
        backgroundColor: "rgba(225, 6, 0, 0.7)",
        borderColor: "rgba(225, 6, 0, 1)",
        borderWidth: 1,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Perfect Prediction",
        data: (() => {
          const min = Math.min(...data.map((item) => item.actual))
          const max = Math.max(...data.map((item) => item.actual))
          return [
            { x: min, y: min },
            { x: max, y: max },
          ]
        })(),
        backgroundColor: "transparent",
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        type: "line",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Actual vs Predicted Q3 Times",
        color: "white",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex
            const dataPoint = data[index]
            if (dataPoint) {
              return [
                `Driver: ${dataPoint.driver}`,
                `Circuit: ${dataPoint.circuit}`,
                `Actual: ${dataPoint.actual.toFixed(3)}s`,
                `Predicted: ${dataPoint.predicted.toFixed(3)}s`,
                `Error: ${(dataPoint.predicted - dataPoint.actual).toFixed(3)}s`,
              ]
            }
            return ""
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Actual Q3 Time (seconds)",
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        title: {
          display: true,
          text: "Predicted Q3 Time (seconds)",
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  }

  return <Scatter data={chartData} options={chartOptions} />
}

export default ModelPerformanceChart
