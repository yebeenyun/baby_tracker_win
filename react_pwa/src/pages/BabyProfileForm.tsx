import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createChild } from "../api/api"
import "../styles/babyprofileForm.css"

export default function BabyProfileForm() {
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")

  const [formData, setFormData] = useState({
    name: "",
    birth_date: "",
    gender: "male",
    photo: null as File | null,
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))

      // 미리보기 생성
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!userId) {
      setError("사용자 정보가 없습니다")
      return
    }

    if (!formData.name || !formData.birth_date) {
      setError("이름과 생년월일은 필수입니다")
      return
    }

    setLoading(true)

    try {
      const form = new FormData()
      form.append("user_id", userId)
      form.append("name", formData.name)
      form.append("birth_date", formData.birth_date)
      form.append("gender", formData.gender)
      if (formData.photo) {
        form.append("photo", formData.photo)
      }

      await createChild(form)
      navigate("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "아기 프로필 생성 실패")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="baby-profile-container">
      <div className="baby-profile-box">
        <h1>아기 프로필 만들기</h1>

        <form onSubmit={handleSubmit}>
          {/* 사진 업로드 */}
          <div className="photo-section">
            <div className="photo-preview">
              {preview ? (
                <img src={preview} alt="아기 사진 미리보기" />
              ) : (
                <div className="photo-placeholder">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zm3.5-9h-7v-6h-6v-7h6v-6h7v6h6v7h-6v6z"
                      fill="#ccc"
                    />
                  </svg>
                  <p>사진을 선택하세요</p>
                </div>
              )}
            </div>
            <label htmlFor="photo" className="photo-upload-label">
              사진 업로드 (선택)
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="photo-input"
            />
          </div>

          {/* 기본 정보 */}
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="아기 이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="birth_date">생년월일</label>
            <input
              id="birth_date"
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">남아</option>
              <option value="female">여아</option>
              <option value="other">기타</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/home")}
              disabled={loading}
            >
              취소
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "생성 중..." : "프로필 생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}