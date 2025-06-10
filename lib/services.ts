"use client"

import { mockServiceRequests, mockUsers } from "./mock-data"

// Service request functions
export const getServiceRequests = (filters = {}) => {
  let requests = [...mockServiceRequests]

  // Apply filters if any
  if (Object.keys(filters).length > 0) {
    requests = requests.filter((req) => {
      for (const [key, value] of Object.entries(filters)) {
        if (req[key as keyof typeof req] !== value) {
          return false
        }
      }
      return true
    })
  }

  // Add user data
  return requests.map((req) => {
    const customer = mockUsers.find((u) => u.id === req.customer_id)
    return {
      ...req,
      customer: customer
        ? {
            full_name: customer.full_name,
            phone: customer.phone,
            email: customer.email,
          }
        : null,
    }
  })
}

export const createServiceRequest = (data: any) => {
  const newRequest = {
    id: `req-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: "pending",
    ...data,
  }

  // In a real app, we would save this to a database
  // For demo, we'll just return the new request
  return newRequest
}

export const updateServiceRequest = (id: string, data: any) => {
  // In a real app, we would update the database
  // For demo, we'll just return success
  return { success: true }
}
