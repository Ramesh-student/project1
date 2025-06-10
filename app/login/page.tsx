"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "@/lib/auth"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "customer"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn(email, password)

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      // Redirect based on user type
      if (result.user) {
        switch (result.user.user_type) {
          case "customer":
            router.push("/dashboard/customer")
            break
          case "provider":
            if (result.user.service_type === "electrician") {
              router.push("/dashboard/electrician")
            } else if (result.user.service_type === "plumber") {
              router.push("/dashboard/plumber")
            } else {
              router.push("/dashboard/provider")
            }
            break
          case "admin":
            router.push("/dashboard/admin")
            break
          default:
            router.push("/dashboard")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            {userType === "admin" ? "Admin Login" : userType === "provider" ? "Provider Login" : "Customer Login"}
          </h1>
          <p className="mt-2 text-gray-600">Sign in to access your account</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            <button type="submit" className="w-full btn btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts</h3>
            <div className="text-xs text-gray-600">
              <p>
                <strong>Customer:</strong> customer@demo.com / password123
              </p>
              <p>
                <strong>Electrician:</strong> electrician@demo.com / password123
              </p>
              <p>
                <strong>Plumber:</strong> plumber@demo.com / password123
              </p>
              <p>
                <strong>Admin:</strong> admin@demo.com / password123
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
