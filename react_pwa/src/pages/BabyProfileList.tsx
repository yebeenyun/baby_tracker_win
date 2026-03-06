import { useEffect, useState } from "react"
import { getChildren } from "../api/api"
import type { ChildType } from "../types/models"
import { Link } from "react-router-dom"
import { LuPlus } from "react-icons/lu"
import "../styles/babyprofileList.css"

export default function BabyProfileList() {
  const [children, setChildren] = useState<ChildType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const handleGetChildren = async () => {
    setLoading(true)
    setError("")
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        setError("사용자 정보가 없습니다")
        return
      }

      const result = await getChildren(Number(userId))
      setChildren(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "아기 목록 조회 실패")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetChildren()
  }, [])

  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    const months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth())

    if (age === 0) {
      return `${months}개월`
    }
    return `${age}살 ${months % 12}개월`
  }

  const getGenderLabel = (gender: string): string => {
    const labels: { [key: string]: string } = {
      male: "👦 남아",
      female: "👧 여아",
      other: "👶 기타",
    }
    return labels[gender] || gender
  }

  return (
    <div className="baby-profile-container">
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>아기 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={handleGetChildren} className="retry-btn">
            다시 시도
          </button>
        </div>
      ) : (
        <div className="baby-list">
          {children.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👶</div>
              <p>등록된 아기가 없습니다</p>
            </div>
          ) : (
            children.map((item) => (
              <Link
                key={item.id}
                to={`/baby/${item.id}`}
                className="baby-card"
                onClick={() => localStorage.setItem("selectedChildId", item.id.toString())}
              >
                <div className="baby-photo">
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} />
                  ) : (
                    <div className="photo-placeholder">👶</div>
                  )}
                </div>

                <div className="baby-info">
                  <h2 className="baby-name">{item.name}</h2>
                  <p className="baby-gender">{getGenderLabel(item.gender || "other")}</p>
                  <p className="baby-age">{calculateAge(item.birth_date)}</p>
                  <p className="baby-birthdate">
                    {new Date(item.birth_date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="card-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="#667eea"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))
          )}

          {/* 추가 버튼 */}
          <Link to="/baby/new" className="add-baby-card">
            <div className="add-icon">
              <LuPlus size={40} />
            </div>
            <div className="add-text">
              <p>새로운 아기 추가</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}