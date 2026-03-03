import { useEffect, useState } from "react"
import { getFeedings } from "../api/api"
import type { Feeding } from "../types/models"
import useGroupedFeedings from "../hooks/useGroupedFeeding"


export default function Feeding() {
  const [feedings, setFeedings] = useState<Feeding[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    getFeedings(1).then(setFeedings)
  }, [])

  const grouped = useGroupedFeedings(feedings)

  const toggle = (date: string) => {
    setExpanded(expanded === date ? null : date)
  }

  return (
    <div style={{ padding: "16px" }}>
      <h1>🍼 수유 일지</h1>

      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          {/* 날짜 헤더 */}
          <div
            style={{
              cursor: "pointer",
              padding: "12px",
              background: "#f8f8f8",
              borderRadius: "6px",
              marginTop: "12px",
            }}
            onClick={() => toggle(date)}
          >
            <strong>{date}</strong>
            <span style={{ float: "right" }}>
              {expanded === date ? "▲" : "▼"}
            </span>
          </div>

          {/* 펼쳐진 경우만 보여줌 */}
          {expanded === date &&
            items
              .sort(
                (a, b) =>
                  new Date(b.recorded_at).getTime() -
                  new Date(a.recorded_at).getTime()
              )
              .map((f) => (
                <div
                  key={f.id}
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>
                    {new Date(f.recorded_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {" - "}
                  <span>{f.amount}ml</span>
                </div>
              ))}
        </div>
      ))}
    </div>
  )
}