export interface Child {
  id: number
  name: string
  birth_date: string
  gender?: string
  photo?: string
}

export interface Feeding {
  id: number
  child_id: number
  recorded_at: string
  amount: number
  type?: string
  memo?: string
}

export interface Excretion {
  id: number
  child_id: number
  recorded_at: string
  pee?: boolean
  poop?: boolean
  color?: string
  memo?: string
}

export interface Growth {
  id: number
  child_id: number
  date: string
  height?: number
  weight?: number
}

