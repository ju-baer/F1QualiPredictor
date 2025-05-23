"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import type { PredictionData } from "@/lib/types"
import { getTeamColor } from "@/lib/team-colors"

interface TrackVisualizationProps {
  predictions: PredictionData[]
  circuit: string
}

const TrackVisualization: React.FC<TrackVisualizationProps> = ({ predictions, circuit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw track background
    ctx.fillStyle = "#1E1E1E"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw circuit name
    ctx.fillStyle = "#E10600"
    ctx.fillRect(10, 10, 120, 30)
    ctx.fillStyle = "white"
    ctx.font = "bold 14px Arial"
    ctx.fillText(`${circuit} GP`, 20, 30)

    // Draw track outline (oval)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const trackWidth = canvas.width * 0.8
    const trackHeight = canvas.height * 0.7

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 5
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, trackWidth / 2, trackHeight / 2, 0, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw start/finish line
    ctx.setLineDash([])
    ctx.lineWidth = 10

    // Create checkered pattern
    const checkerWidth = 10
    const checkerHeight = 20
    const startX = centerX
    const startY = centerY - trackHeight / 2 - 10

    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? "black" : "white"
      ctx.fillRect(startX - 5 + i * checkerWidth, startY, checkerWidth, checkerHeight)
    }

    // Sort predictions by position
    const sortedPredictions = [...predictions].sort((a, b) => a.position - b.position)

    // Place cars on the track
    sortedPredictions.forEach((driver, index) => {
      // Calculate position on the track (circular path)
      const angle = (index / sortedPredictions.length) * 2 * Math.PI
      const radius = Math.min(trackWidth / 2 - 20, trackHeight / 2 - 20)

      // Convert to cartesian coordinates
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Draw car
      const carWidth = 30
      const carHeight = 15

      ctx.fillStyle = getTeamColor(driver.team)
      ctx.fillRect(x - carWidth / 2, y - carHeight / 2, carWidth, carHeight)

      // Draw position number
      ctx.fillStyle = driver.team === "Haas F1 Team" ? "black" : "white"
      ctx.font = "bold 10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(driver.position.toString(), x, y)

      // Draw driver name
      ctx.fillStyle = "white"
      ctx.font = "10px Arial"
      ctx.fillText(driver.driver.split(" ").pop() || "", x, y + carHeight)
    })
  }, [predictions, circuit])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}

export default TrackVisualization
