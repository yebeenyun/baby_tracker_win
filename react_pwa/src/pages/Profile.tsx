import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Child } from "../types/models"
import { getChild } from "../api/api"

export default function Profile() {
  const [child, setChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getChild(1)
      .then(data => {
        if (!data || data.detail === "Child not found") {
          navigate("/profile/new")
        } else {
          setChild(data)
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!child) {
    return null
  }

  return (
    <div>
      <h1>{child.name}</h1>
    </div>
  )
}