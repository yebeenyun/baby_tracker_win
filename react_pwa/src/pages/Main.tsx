import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Main() {
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("userId")

    if (!userId) {
      navigate("/login")
    } else {
    }
  }, [navigate])

  return (
    <div>
      Main
    </div>
  )
}