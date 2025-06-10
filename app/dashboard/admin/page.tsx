"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getServiceRequests } from "@/lib/services"
import { mockUsers } from "@/lib/mock-data"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login?type=admin")
      return
    }

    if (currentUser.user_type !== "admin") {
      router.push(`/dashboard/${currentUser.user_type}`)
      return
    }

    setUser(currentUser)

    // Get all service requests
    const serviceRequests = getServiceRequests()
    setRequests(serviceRequests)

    // Get all users
    setUsers(mockUsers)

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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem("currentUser")
                router.push("/login?type=admin")
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-2">Service Requests</h3>
            <p className="text-3xl font-bold">{requests.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-2">Active Providers</h3>
            <p className="text-3xl font-bold">{users.filter((u) => u.user_type === "provider").length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Service Requests</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.slice(0, 5).map((request) => {
                  const customer = users.find((u) => u.id === request.customer_id)
                  return (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer?.full_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.service_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.preferred_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                          {request.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.user_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
