"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CircuitSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export const CircuitSelector: React.FC<CircuitSelectorProps> = ({ value, onValueChange }) => {
  const circuits = [
    { name: "Bahrain", flag: "🇧🇭" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "China", flag: "🇨🇳" },
    { name: "Miami", flag: "🇺🇸" },
    { name: "Emilia Romagna", flag: "🇮🇹" },
    { name: "Monaco", flag: "🇲🇨" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Austria", flag: "🇦🇹" },
    { name: "Great Britain", flag: "🇬🇧" },
    { name: "Hungary", flag: "🇭🇺" },
    { name: "Belgium", flag: "🇧🇪" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Azerbaijan", flag: "🇦🇿" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "United States", flag: "🇺🇸" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Las Vegas", flag: "🇺🇸" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "Abu Dhabi", flag: "🇦🇪" },
  ]

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select circuit" />
      </SelectTrigger>
      <SelectContent>
        {circuits.map((circuit) => (
          <SelectItem key={circuit.name} value={circuit.name}>
            {circuit.flag} {circuit.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
