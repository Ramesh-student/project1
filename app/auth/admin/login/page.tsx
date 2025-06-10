"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, UserPlus } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        // Handle specific authentication errors
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials.")
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email address before logging in.")
        }
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error("Login failed. Please try again.")
      }

      // Check if user exists in our users table and is an admin
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("user_type, full_name, email")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        // If user doesn't exist in our users table
        if (profileError.message.includes("No rows found")) {
          await supabase.auth.signOut()
          throw new Error("Admin account not found. Please contact system administrator.")
        }
        throw new Error("Error verifying admin status. Please try again.")
      }

      // Verify admin privileges
      if (!profile || profile.user_type !== "admin") {
        await supabase.auth.signOut()
        throw new Error("Access denied. This account does not have administrator privileges.")
      }

      // Log successful admin login
      try {
        await supabase.from("admin_activity_log").insert({
          admin_id: data.user.id,
          action_type: "login",
          action_details: {
            method: "password",
            email: formData.email,
            timestamp: new Date().toISOString(),
          },
          ip_address: "client_ip",
        })
      } catch (logError) {
        // Don't fail login if logging fails
        console.warn("Failed to log admin activity:", logError)
      }

      // Successful admin login
      router.push("/admin/dashboard")
    } catch (error: any) {
      console.error("Admin login error:", error)
      setError(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-900 text-gray-100">
        <CardHeader className="text-center border-b border-gray-800 pb-6">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
          <CardDescription className="text-gray-400">Secure login for system administrators</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Demo Credentials Helper */}
          <div className="bg-yellow-900/30 border border-yellow-800 rounded-md p-3 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-300 text-sm font-medium mb-1">Demo Environment</p>
                <p className="text-yellow-200 text-xs">
                  In preview mode, create an admin account first using the "Create Admin Account" button below, or use
                  any email/password combination (minimum 6 characters) to test the interface.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {/* Admin Signup Option */}
            <div className="text-center">
              <div className="bg-blue-900/30 border border-blue-800 rounded-md p-4">
                <div className="flex items-center justify-center mb-2">
                  <UserPlus className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-blue-300 font-medium">Need an Admin Account?</span>
                </div>
                <p className="text-blue-200 text-sm mb-3">
                  Create a new administrator account to manage the ServiceHub platform
                </p>
                <Link href="/auth/admin/signup">
                  <Button variant="outline" className="w-full border-blue-700 text-blue-300 hover:bg-blue-900/50">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Admin Account
                  </Button>
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Return to{" "}
                <Link href="/" className="text-blue-400 hover:underline">
                  main site
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                For customer or provider accounts, use the{" "}
                <Link href="/auth/login" className="text-blue-400 hover:underline">
                  regular login
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
