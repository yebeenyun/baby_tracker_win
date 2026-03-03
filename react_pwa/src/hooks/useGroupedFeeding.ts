import type { Feeding } from "../types/models"

export default function useGroupedFeedings(feedings: Feeding[]) {
  return feedings.reduce((grouped, f) => {
    const date = new Date(f.recorded_at).toLocaleDateString()
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(f)
    return grouped
  }, {} as Record<string, Feeding[]>)
}