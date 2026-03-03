import { Link } from "react-router-dom"

export default function BottomNav() {
  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      background: "#eee",
      padding: "10px 0"
    }}>
      <Link to="/">Main</Link>
      <Link to="/feeding">Feeding</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  )
}