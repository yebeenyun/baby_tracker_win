import { useState, useEffect } from "react"

// 사용자 정보 예시 (실제 데이터 연동 시 props 또는 context 사용)
const mockUser = {
  name: '홍길동',
  email: 'hong@example.com',
  joined: '2024-01-01',
}

function ThemeSelector() {
  const [theme, setTheme] = useState('')
  useEffect(() => {
    if (theme) {
      document.documentElement.className = theme
    } else {
      document.documentElement.className = ''
    }
  }, [theme])
  return (
    <div style={{ marginTop: 24 }}>
      <label htmlFor="theme-select" style={{ marginRight: 8 }}>테마 선택:</label>
      <select
        id="theme-select"
        value={theme}
        onChange={e => setTheme(e.target.value)}
        style={{ padding: 6, borderRadius: 6 }}
        aria-label="테마 선택"
      >
        <option value="">핑크 테마</option>
        <option value="theme-blue">파랑 테마</option>
        <option value="theme-orange">주황 테마</option>
      </select>
    </div>
  )
}

export default function Profile() {
  return (
    <div style={{ maxWidth: 360, margin: '40px auto 0 auto' }}>
      <h2 style={{ marginBottom: 20, color: 'var(--primary)', fontSize: 22 }}>내 프로필</h2>
      <div style={{ marginBottom: 10 }}>
        <strong>이름:</strong> {mockUser.name}
      </div>
      <div style={{ marginBottom: 10 }}>
        <strong>이메일:</strong> {mockUser.email}
      </div>
      <div style={{ marginBottom: 18 }}>
        <strong>가입일:</strong> {mockUser.joined}
      </div>
      <ThemeSelector />
    </div>
  )
}