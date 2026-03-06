import { Link, useLocation } from "react-router-dom"
import { TbMilk } from "react-icons/tb"
import { TbToiletPaper } from "react-icons/tb"
import { GoHome } from "react-icons/go"
import { LuBaby } from "react-icons/lu"
import { IoPersonCircleOutline } from "react-icons/io5"
import "../styles/bottomnav.css"

const IconSize = 30

export default function BottomNav() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav>
      <Link
        to="/feeding"
        className={isActive("/feeding") ? "active" : ""}
        title="식사"
      >
        <TbMilk size={IconSize} />
      </Link>
      <Link
        to="/poop"
        className={isActive("/poop") ? "active" : ""}
        title="배설"
      >
        <TbToiletPaper size={IconSize} />
      </Link>
      <Link
        to="/home"
        className={isActive("/home") ? "active" : ""}
        title="홈"
      >
        <GoHome size={IconSize} />
      </Link>
      <Link
        to="/baby"
        className={isActive("/baby") ? "active" : ""}
        title="아기"
      >
        <LuBaby size={IconSize} />
      </Link>
      <Link
        to="/profile"
        className={isActive("/profile") ? "active" : ""}
        title="프로필"
      >
        <IoPersonCircleOutline size={IconSize} />
      </Link>
    </nav>
  )
}