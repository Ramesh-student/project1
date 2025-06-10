"use client"

import { mockUsers } from "./mock-data"

// Simple authentication functions
export const signIn = async (email: string, password: string) => {
  // Find user in mock data
  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { error: "Invalid credentials" }
  }

  // Store in localStorage for persistence
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        service_type: user.service_type,
      }),
    )
  }

  return { user: { id: user.id, email: user.email, user_type: user.user_type } }
}

export const signOut = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userJson = localStorage.getItem("currentUser")
    if (userJson) {
      return JSON.parse(userJson)
    }
  }
  return null
}

export const getUserProfile = (userId: string) => {
  return mockUsers.find((u) => u.id === userId)
}
