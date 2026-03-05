import type { FeedingType } from "../types/models"

export default function useGroupedFeedings(feedings: FeedingType[]) {
  return feedings.reduce((grouped, f) => {
    const date = new Date(f.date_time).toLocaleDateString()
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(f)
    return grouped
  }, {} as Record<string, FeedingType[]>)
}