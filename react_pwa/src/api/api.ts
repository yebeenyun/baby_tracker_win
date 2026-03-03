import type { Child, Feeding } from "../types/models"


const BASE_URL = "http://127.0.0.1:8000"

export async function getChildren(): Promise<Child[]> {
  const res = await fetch(`${BASE_URL}/child/`)
  return res.json()
}

export async function getFeedings(childId: number): Promise<Feeding[]> {
  const res = await fetch(`${BASE_URL}/feeding/${childId}`)
  return res.json()
}

export async function createFeeding(data: Partial<Feeding>): Promise<Feeding> {
  const res = await fetch(`${BASE_URL}/feeding/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const getChild = async (id: number) => {
  const res = await fetch(`${BASE_URL}/child/${id}`)
  return res.json()
}

export const getGrowth = async (childId: number) => {
  const res = await fetch(`${BASE_URL}/growth/${childId}`)
  return res.json()
}

export const createChild = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/child/`, {
    method: "POST",
    body: formData,
  })
  return res.json()
}

export const updateChild = async (id: number, formData: FormData) => {
  const res = await fetch(`${BASE_URL}/child/${id}`, {
    method: "PUT",
    body: formData,
  })
  return res.json()
}