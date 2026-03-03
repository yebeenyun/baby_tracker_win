import { useEffect, useState } from "react"
import { getFeedings } from "../api/api"
import type { Feeding } from "../types/models"

export default function Home() {
  const [feedings, setFeedings] = useState<Feeding[]>([])

  useEffect(() => {
    getFeedings(1).then(setFeedings)
  }, [])

  const todayTotal = feedings.reduce((sum, f) => sum + f.amount, 0)

  return (
    <div>
      <h1>🏠 Home</h1>
      <p>오늘 총 수유량: {todayTotal} ml</p>

      <button
  style={{
    position: "fixed",
    right: 16,
    bottom: 80,
    padding: "14px 20px",
    borderRadius: "50%",
    background: "#ff4081",
    border: "none",
    color: "white",
    fontSize: "24px",
  }}
  onClick={() => {
    /* 입력 모달 표시 */
  }}
>
  +
</button>
      {feedings.slice(-5).map(f => (
        <div key={f.id}>
          {new Date(f.recorded_at).toLocaleTimeString()} - {f.amount}ml
        </div>
      ))}
    </div>
  )
}