import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/api"
import "../styles/login.css"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await loginUser({ email, password })
      
      // localStorage에 userId 저장
      localStorage.setItem("userId", result.id.toString())
      localStorage.setItem("userName", result.name)
      localStorage.setItem("userEmail", result.email)
      
      navigate("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = () => {
    navigate("/signup")
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Baby Tracker</h1>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="signup-section">
          <p>계정이 없으신가요?</p>
          <button
            type="button"
            className="signup-btn"
            onClick={handleSignUp}
            disabled={loading}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}