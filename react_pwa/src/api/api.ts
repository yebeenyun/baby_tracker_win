import type { UserType, ChildType, FeedingType, ExcretionType, GrowthType } from "../types/models"

const BASE_URL = "http://127.0.0.1:8000"

/* ----------------- User ----------------- */

export async function createUser(data: {
  email: string
  password: string
  name: string
  phone?: string
}): Promise<UserType> {
  const res = await fetch(`${BASE_URL}/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "회원가입 실패")
  }
  
  return res.json()
}

export async function loginUser(data: {
  email: string
  password: string
}): Promise<{ id: number; email: string; name: string }> {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "로그인 실패")
  }
  
  return res.json()
}

export async function getUser(userId: number): Promise<UserType> {
  const res = await fetch(`${BASE_URL}/user/${userId}`)
  
  if (!res.ok) {
    throw new Error("사용자 조회 실패")
  }
  
  return res.json()
}

export async function updateUser(
  userId: number,
  data: { name?: string; phone?: string; password?: string }
): Promise<UserType> {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    throw new Error("사용자 정보 수정 실패")
  }
  
  return res.json()
}

export async function deleteUser(userId: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "DELETE",
  })
  
  if (!res.ok) {
    throw new Error("사용자 삭제 실패")
  }
  
  return res.json()
}

/* ----------------- Child ----------------- */

export async function getChildren(userId?: number): Promise<ChildType[]> {
  const url = new URL(`${BASE_URL}/child/`)
  if (userId) {
    url.searchParams.append("user_id", userId.toString())
  }
  
  const res = await fetch(url.toString())
  return res.json()
}

export const getChild = async (id: number): Promise<ChildType | undefined> => {
  const res = await fetch(`${BASE_URL}/child/${id}`)
  
  if (!res.ok) {
    return undefined
  }
  
  return res.json()
}

export const createChild = async (formData: FormData): Promise<ChildType> => {
  const res = await fetch(`${BASE_URL}/child/`, {
    method: "POST",
    body: formData,
  })
  
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "자녀 생성 실패")
  }
  
  return res.json()
}

export async function deleteChild(childId: number): Promise<void> {
  const res = await fetch(`/api/child/${childId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || '아기 삭제 실패')
  }
}

/* ----------------- Feeding ----------------- */

export async function getFeedings(childId: number): Promise<FeedingType[]> {
  const res = await fetch(`${BASE_URL}/feeding/${childId}`)
  const data = await res.json()

  // 🔥 date_time → recorded_at 변환
  return data.map((item: any) => ({
    ...item,
    recorded_at: item.date_time,
  }))
}

export async function createFeeding(data: Partial<FeedingType>): Promise<FeedingType> {
  const payload = {
    child_id: data.child_id,
    date_time: data.date_time,
    amount: data.amount,
    type: data.type,
    memo: data.memo,
  }

  const res = await fetch(`${BASE_URL}/feeding/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("식사 기록 생성 실패")
  }

  const result = await res.json()

  return {
    ...result,
    recorded_at: result.date_time,
  }
}

/* ----------------- Excretion ----------------- */

export async function getExcretions(childId: number): Promise<ExcretionType[]> {
  const res = await fetch(`${BASE_URL}/excretion/${childId}`)
  const data = await res.json()

  return data.map((item: any) => ({
    ...item,
    recorded_at: item.date_time,
  }))
}

export async function createExcretion(data: Partial<ExcretionType>): Promise<ExcretionType> {
  const payload = {
    child_id: data.child_id,
    date_time: data.date_time,
    pee: data.pee,
    poop: data.poop,
    color: data.color,
    memo: data.memo,
  }

  const res = await fetch(`${BASE_URL}/excretion/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("배설 기록 생성 실패")
  }

  const result = await res.json()

  return {
    ...result,
    recorded_at: result.date_time,
  }
}

/* ----------------- Growth ----------------- */

export const getGrowth = async (childId: number): Promise<GrowthType[]> => {
  const res = await fetch(`${BASE_URL}/growth/${childId}`)
  return res.json()
}

export const createGrowth = async (data: Partial<GrowthType>): Promise<GrowthType> => {
  const payload = {
    child_id: data.child_id,
    date: data.date,
    height: data.height,
    weight: data.weight,
  }

  const res = await fetch(`${BASE_URL}/growth/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error("성장 기록 생성 실패")
  }

  return res.json()
}