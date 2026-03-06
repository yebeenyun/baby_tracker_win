import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { getChild, getChildren, deleteChild } from "../api/api"
import type { ChildType } from "../types/models"
import { IoArrowBack } from "react-icons/io5"
import { HiPencil } from "react-icons/hi2"
import "../styles/babyprofile.css"

export default function BabyProfile() {
  const { babyId } = useParams()
  const navigate = useNavigate()
  const [child, setChild] = useState<ChildType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [children, setChildren] = useState<ChildType[]>([])
  const [childrenLoading, setChildrenLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const lastFocusedRef = useRef<HTMLButtonElement | null>(null)

  // 아기 목록 조회
  useEffect(() => {
    ;(async () => {
      try {
        setChildrenLoading(true)
        const res = await getChildren()
        setChildren(res)
      } catch {
        setChildren([])
      } finally {
        setChildrenLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    const fetchChild = async () => {
      if (!babyId) {
        setError("유효하지 않은 아기 ID입니다")
        setLoading(false)
        return
      }

      try {
        const result = await getChild(Number(babyId))
        if (!result) {
          setError("아기 정보를 찾을 수 없습니다")
        } else {
          setChild(result)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "아기 정보 조회 실패")
      } finally {
        setLoading(false)
      }
    }

    fetchChild()
  }, [babyId])

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

  const getDaysUntilBirthday = (birthDate: string): number => {
    const birth = new Date(birthDate)
    const today = new Date()
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())

    if (nextBirthday < today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    }

    const diff = nextBirthday.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const handleDelete = async () => {
    if (!babyId) return
    setDeleteLoading(true)
    setDeleteError("")
    try {
      await deleteChild(Number(babyId))
      setShowDeleteModal(false)
      navigate("/baby")
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "삭제 실패")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="baby-detail-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>아기 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !child) {
    return (
      <div className="baby-detail-container">
        <div className="error-state">
          <p className="error-message">{error || "아기 정보를 찾을 수 없습니다"}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            뒤로가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="baby-detail-container">
      {/* 헤더 */}
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <IoArrowBack size={24} />
        </button>
        {/* 콤보박스: 아기 선택 */}
        {childrenLoading ? (
          <div style={{ flex: 1, textAlign: "center", color: "var(--gray)" }}>
            아기 목록 불러오는 중...
          </div>
        ) : (
          <div className="baby-switcher-wrap">
            <select
              className="baby-switcher-select"
              value={babyId || ""}
              onChange={e => {
                if (e.target.value) navigate(`/baby/${e.target.value}`)
              }}
              aria-label="아기 선택"
            >
              {children.length === 0 && <option value="">아기 없음</option>}
              {children.map(c => (
                <option key={c.id} value={c.id}>
                  👶 {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button className="edit-button">
          <HiPencil size={24} />
        </button>
      </div>

      {/* 프로필 섹션 */}
      <div className="profile-section">
        <div className="profile-photo">
          {child.photo ? (
            <img src={child.photo} alt={child.name} />
          ) : (
            <div className="photo-placeholder">👶</div>
          )}
        </div>

        <div className="profile-info">
          <h2 className="child-name">{child.name}</h2>
          <p className="child-gender">
            {getGenderLabel(child.gender || "other")}
          </p>
        </div>
      </div>

      {/* 정보 카드 */}
      <div className="info-cards">
        {/* 나이 카드 */}
        <div className="info-card">
          <div className="card-icon">🎂</div>
          <div className="card-content">
            <p className="card-label">나이</p>
            <p className="card-value">{calculateAge(child.birth_date)}</p>
          </div>
        </div>

        {/* 생년월일 카드 */}
        <div className="info-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <p className="card-label">생년월일</p>
            <p className="card-value">
              {new Date(child.birth_date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* 생일까지 남은 날 카드 */}
        <div className="info-card">
          <div className="card-icon">🎉</div>
          <div className="card-content">
            <p className="card-label">생일까지</p>
            <p className="card-value">
              {getDaysUntilBirthday(child.birth_date)}일
            </p>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="details-section">
        <h3>상세 정보</h3>
        <div className="detail-item">
          <span className="detail-label">이름</span>
          <span className="detail-value">{child.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">성별</span>
          <span className="detail-value">
            {getGenderLabel(child.gender || "other")}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">생년월일</span>
          <span className="detail-value">
            {new Date(child.birth_date).toLocaleDateString("ko-KR")}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">등록일</span>
          <span className="detail-value">
            {new Date(child.created_at).toLocaleDateString("ko-KR")}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="action-buttons">
        <button className="edit-full-btn">
          <HiPencil size={18} />
          정보 수정
        </button>
        <button
          className="delete-btn subtle"
          onClick={() => {
            setShowDeleteModal(true)
            lastFocusedRef.current = document.activeElement as HTMLButtonElement
          }}
        >
          삭제
        </button>
      </div>
      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 17 }}>정말 삭제할까요?</div>
            {deleteError && <div className="error-message" style={{ marginBottom: 8 }}>{deleteError}</div>}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteError("")
                  setTimeout(() => lastFocusedRef.current?.focus(), 0)
                }}
                style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', color: '#666', fontWeight: 500 }}
                disabled={deleteLoading}
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#e53e3e', color: '#fff', fontWeight: 600 }}
                disabled={deleteLoading}
              >
                {deleteLoading ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)} />
        </div>
      )}
    </div>
  )
}