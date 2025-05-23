"use client"

import type React from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { getTeamColor } from "@/lib/team-colors"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface HistoricalDataChartProps {
  data: any[]
  type: "circuit" | "driver" | "team"
}

const HistoricalDataChart: React.FC<HistoricalDataChartProps> = ({ data, type }) => {
  let chartData
  let chartOptions

  if (type === "circuit") {
    chartData = {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "Average Q3 Time (seconds)",
          data: data.map((item) => item.averageTime),
          backgroundColor: "#0090FF",
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderWidth: 1,
        },
      ],
    }

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Average Q3 Time by Circuit",
          color: "white",
          font: {
            size: 16,
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
            text: "Average Q3 Time (seconds)",
            color: "white",
          },
        },
      },
    }
  } else if (type === "driver") {
    chartData = {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "Average Q3 Time (seconds)",
          data: data.map((item) => item.averageTime),
          backgroundColor: "#E10600",
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderWidth: 1,
        },
      ],
    }

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Average Q3 Time by Driver",
          color: "white",
          font: {
            size: 16,
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
            text: "Average Q3 Time (seconds)",
            color: "white",
          },
        },
      },
    }
  } else {
    // Team chart with team colors
    chartData = {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "Average Q3 Time (seconds)",
          data: data.map((item) => item.averageTime),
          backgroundColor: data.map((item) => getTeamColor(item.name)),
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderWidth: 1,
        },
      ],
    }

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Average Q3 Time by Team",
          color: "white",
          font: {
            size: 16,
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
            text: "Average Q3 Time (seconds)",
            color: "white",
          },
        },
      },
    }
  }

  return <Bar data={chartData} options={chartOptions} />
}

export default HistoricalDataChart
