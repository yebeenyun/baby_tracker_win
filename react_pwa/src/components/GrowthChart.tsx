import { Line } from "react-chartjs-2"
import type { Growth } from "../types/models"

interface Props {
  growth: Growth[]
}

export default function GrowthChart({ growth }: Props) {
  const data = {
    labels: growth.map(g => g.date),
    datasets: [
      {
        label: "키 (cm)",
        data: growth.map(g => g.height),
        borderColor: "blue",
      },
      {
        label: "몸무게 (kg)",
        data: growth.map(g => g.weight),
        borderColor: "green",
      },
    ],
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h3>성장 그래프</h3>
      <Line data={data} />
    </div>
  )
}