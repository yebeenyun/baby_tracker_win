export interface UserType {
  id: number
  email: string
  name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface ChildType {
  id: number
  user_id: number
  name: string
  birth_date: string
  gender?: string
  photo?: string
  created_at: string
  feedingInterval: number; // 수유 텀 (분 단위)
}

export interface FeedingType {
  id: number
  child_id: number
  date_time: string
  recorded_at?: string
  amount: number
  type?: string
  memo?: string
  created_at: string
}

export interface ExcretionType {
  id: number
  child_id: number
  date_time: string
  recorded_at?: string
  pee?: boolean
  poop?: boolean
  color?: string
  memo?: string
  created_at: string
}

export interface GrowthType {
  id: number
  child_id: number
  date: string
  height?: number
  weight?: number
  created_at: string
}