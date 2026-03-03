import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Feeding from "./pages/Feeding"
import Profile from "./pages/Profile"
import BottomNav from "./components/BottomNav"
import ProfileForm from "./pages/ProfileForm"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feeding" element={<Feeding />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/new" element={<ProfileForm />} />
      </Routes>

      <BottomNav />
    </BrowserRouter>
  )
}