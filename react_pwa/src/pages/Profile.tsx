import { useState, useEffect } from "react"
import { FaUser, FaEnvelope, FaCalendar, FaPalette } from 'react-icons/fa'

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
    <div>
      <select
        id="theme-select"
        value={theme}
        onChange={e => setTheme(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '12px', 
          borderRadius: '8px', 
          border: '2px solid var(--primary-light)', 
          backgroundColor: 'var(--white)', 
          color: 'var(--primary-dark)', 
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'border-color 0.3s'
        }}
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
    <div style={{ 
      maxWidth: 400, 
      margin: '40px auto 0 auto', 
      padding: '20px',
      backgroundColor: 'var(--primary-xlight)', 
      borderRadius: '15px', 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      minHeight: '60vh'
    }}>
      <h2 style={{ 
        marginBottom: 30, 
        color: 'var(--primary-dark)', 
        fontSize: 28, 
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        내 프로필
      </h2>
      
      <div style={{ 
        backgroundColor: 'var(--white)', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: 20,
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 15,
          padding: '10px 0'
        }}>
          <FaUser style={{ color: 'var(--primary)', marginRight: 15, fontSize: 20 }} />
          <div>
            <strong style={{ color: 'var(--primary-dark)' }}>이름:</strong> {mockUser.name}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 15,
          padding: '10px 0'
        }}>
          <FaEnvelope style={{ color: 'var(--primary)', marginRight: 15, fontSize: 20 }} />
          <div>
            <strong style={{ color: 'var(--primary-dark)' }}>이메일:</strong> {mockUser.email}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '10px 0'
        }}>
          <FaCalendar style={{ color: 'var(--primary)', marginRight: 15, fontSize: 20 }} />
          <div>
            <strong style={{ color: 'var(--primary-dark)' }}>가입일:</strong> {mockUser.joined}
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: 'var(--white)', 
        padding: '20px', 
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
          <FaPalette style={{ color: 'var(--primary)', marginRight: 10, fontSize: 20 }} />
          <strong style={{ color: 'var(--primary-dark)', fontSize: 18 }}>테마 선택</strong>
        </div>
        <ThemeSelector />
      </div>
    </div>
  )
}