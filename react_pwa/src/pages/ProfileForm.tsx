import { useState } from "react"
import { createChild } from "../api/api"
import { useNavigate } from "react-router-dom"

export default function ProfileForm() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [gender, setGender] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append("name", name)
    formData.append("birth_date", birthDate)
    formData.append("gender", gender)
    if (photo) formData.append("photo", photo)

    await createChild(formData)
    navigate("/profile")
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-2xl font-bold mb-6 text-center">
        👶 프로필 등록
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">

        {/* 사진 업로드 */}
        <div className="flex flex-col items-center">
          <label className="cursor-pointer">
            <img
              src={preview || "/default.png"}
              alt="preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            사진 선택
          </p>
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
            placeholder="이름 입력"
          />
        </div>

        {/* 생일 */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            생일
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
          />
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            성별
          </label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none"
          >
            <option value="">선택</option>
            <option value="남아">남아</option>
            <option value="여아">여아</option>
          </select>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full bg-pink-500 text-white p-3 rounded-xl font-semibold shadow-md hover:bg-pink-600 transition"
        >
          저장하기
        </button>
      </div>
    </div>
  )
}