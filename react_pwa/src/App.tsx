import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Feeding from "./pages/Feeding"
import Profile from "./pages/Profile"
import BottomNav from "./components/BottomNav"
import BabyProfileForm from "./pages/BabyProfileForm"
import Main from "./pages/Main"
import Poop from "./pages/Poop"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import BabyProfile from "./pages/BabyProfile"
import BabyProfileList from "./pages/BabyProfileList"

function AppContent() {
  const location = useLocation()
  const hideBottomNav = (location.pathname === "/" || location.pathname==="/login" || location.pathname==="/signup")
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/poop" element={<Poop />} />
        <Route path="/feeding" element={<Feeding />} />
        <Route path="/baby" element={<BabyProfileList />} />
        <Route path="/baby/new" element={<BabyProfileForm />} />
        <Route path="/baby/:babyId" element={<BabyProfile />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!hideBottomNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}