export const TEAM_COLORS = {
  "Red Bull Racing": "#0600EF",
  Ferrari: "#DC0000",
  Mercedes: "#00D2BE",
  McLaren: "#FF8700",
  "Aston Martin": "#006F62",
  RB: "#0090FF",
  Williams: "#005AFF",
  "Haas F1 Team": "#FFFFFF",
  "Kick Sauber": "#900000",
  Alpine: "#0090FF",
}

export function getTeamColor(team: string): string {
  return TEAM_COLORS[team as keyof typeof TEAM_COLORS] || "#FFFFFF"
}
