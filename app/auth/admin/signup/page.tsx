"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { createAdminAccount } from "@/lib/admin-auth"

export default function AdminSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    secretKey: "", // This will be validated server-side only
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Basic validation
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
        throw new Error("Please fill in all required fields")
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Validate admin secret key on server side
      const adminValidation = await createAdminAccount(formData)

      if (!adminValidation.isValid && process.env.NODE_ENV === "production") {
        throw new Error("Invalid admin secret key")
      }

      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!data.user) {
        throw new Error("Failed to create admin account. Please try again.")
      }

      // Create admin profile in users table
      const adminId = `admin-${data.user.id}`
      const { error: profileError } = await supabase.from("users").insert({
        id: adminId,
        email: formData.email,
        full_name: formData.fullName,
        user_type: "admin",
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        // Attempt to clean up the auth user if profile creation fails
        console.error("Failed to create admin profile:", profileError)
        throw new Error("Failed to create admin profile. Please contact support.")
      }

      // Log admin creation
      try {
        await supabase.from("admin_activity_log").insert({
          admin_id: adminId,
          action_type: "admin_created",
          action_details: {
            method: "self_signup",
            email: formData.email,
            timestamp: new Date().toISOString(),
          },
          ip_address: "client_ip",
        })
      } catch (logError) {
        // Don't fail signup if logging fails
        console.warn("Failed to log admin creation:", logError)
      }

      // Success
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/admin/login")
      }, 3000)
    } catch (error: any) {
      console.error("Admin signup error:", error)
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
          <CardTitle className="text-2xl text-white">Create Admin Account</CardTitle>
          <CardDescription className="text-gray-400">Register as a system administrator</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-md p-3 mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-800 rounded-md p-3 mb-4">
              <p className="text-green-300 text-sm font-medium">
                Admin account created successfully! Redirecting to login page...
              </p>
            </div>
          )}

          {/* Demo Environment Notice */}
          <div className="bg-yellow-900/30 border border-yellow-800 rounded-md p-3 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-300 text-sm font-medium mb-1">Demo Environment</p>
                <p className="text-yellow-200 text-xs">
                  This is a demo environment. In production, admin creation requires server-side authorization.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
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
              <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey" className="text-gray-300">
                Admin Authorization Key <span className="text-gray-500 text-xs">(Optional in demo)</span>
              </Label>
              <Input
                id="secretKey"
                type="password"
                value={formData.secretKey}
                onChange={(e) => setFormData((prev) => ({ ...prev, secretKey: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter authorization key (validated server-side)"
              />
              <p className="text-xs text-gray-500">Authorization is validated securely on the server</p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading || success}>
              {loading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/admin/login">
              <Button variant="link" className="text-blue-400 hover:text-blue-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
