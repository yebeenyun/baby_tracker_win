import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUser } from "../api/api"
import "../styles/signup.css"

export default function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 유효성 검사
    if (!formData.email || !formData.password || !formData.name) {
      setError("이메일, 비밀번호, 이름은 필수입니다")
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다")
      return
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다")
      return
    }

    setLoading(true)

    try {
      const result = await createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
      })

      // 회원가입 성공 후 로그인 페이지로 이동
      navigate("/login", { state: { email: result.email } })
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 실패")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Baby Tracker</h1>
        <p className="subtitle">새 계정 만들기</p>

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호 (선택)</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="6자 이상 입력하세요"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="login-section">
          <p>이미 계정이 있으신가요?</p>
          <button
            type="button"
            className="login-link-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  )
}