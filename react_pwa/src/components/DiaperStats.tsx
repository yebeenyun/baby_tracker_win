import { useEffect, useState } from "react"

export default function DiaperStats({ childId }: { childId: number }) {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/excretion/stats/${childId}`)
      .then(res => res.json())
      .then(setStats)
  }, [childId])

  if (!stats) return null

  return (
    <div style={{ marginTop: 30 }}>
      <h3>기저귀 사용량</h3>
      <p>오늘: {stats.today}개</p>
      <p>이번 달: {stats.month}개</p>
    </div>
  )
}