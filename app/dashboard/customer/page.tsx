"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getServiceRequests } from "@/lib/services"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (currentUser.user_type !== "customer") {
      router.push(`/dashboard/${currentUser.user_type}`)
      return
    }

    setUser(currentUser)

    // Get service requests
    const serviceRequests = getServiceRequests({ customer_id: currentUser.id })
    setRequests(serviceRequests)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem("currentUser")
                router.push("/login")
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Service Requests</h2>
          <Link href="/dashboard/customer/book" className="btn btn-primary">
            Book New Service
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">You don't have any service requests yet.</p>
            <Link href="/dashboard/customer/book" className="mt-4 btn btn-primary inline-block">
              Book Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">
                      {request.service_type.charAt(0).toUpperCase() + request.service_type.slice(1)} Service
                    </h3>
                    <p className="text-gray-600 mt-1">{request.problem_description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "payment_pending"
                          ? "bg-blue-100 text-blue-800"
                          : request.status === "in_progress"
                            ? "bg-green-100 text-green-800"
                            : request.status === "completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status.replace("_", " ").charAt(0).toUpperCase() +
                      request.status.replace("_", " ").slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Date:</span> <span>{request.preferred_date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span> <span>{request.preferred_time}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span> <span>{formatDate(request.created_at)}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  {request.status === "payment_pending" && <button className="btn btn-primary">Make Payment</button>}

                  {request.status === "pending" && <button className="btn btn-secondary">Cancel Request</button>}

                  {request.status === "completed" && <button className="btn btn-secondary">Leave Review</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
