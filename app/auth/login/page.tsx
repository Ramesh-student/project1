"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Users, Wrench } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const demoAccounts = [
    { type: "Customer", email: "customer@demo.com", icon: Users, color: "bg-blue-100 text-blue-700" },
    { type: "Electrician", email: "electrician@demo.com", icon: Zap, color: "bg-yellow-100 text-yellow-700" },
    { type: "Plumber", email: "plumber@demo.com", icon: Wrench, color: "bg-green-100 text-green-700" },
    { type: "Admin", email: "admin@demo.com", icon: Shield, color: "bg-purple-100 text-purple-700" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate login logic
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo login routing
      if (email === "customer@demo.com" && password === "password123") {
        router.push("/dashboard/customer")
      } else if (email === "electrician@demo.com" && password === "password123") {
        router.push("/dashboard/electrician")
      } else if (email === "plumber@demo.com" && password === "password123") {
        router.push("/dashboard/plumber")
      } else if (email === "admin@demo.com" && password === "password123") {
        router.push("/admin/dashboard")
      } else {
        setError("Invalid credentials. Please use demo accounts or check your login details.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("password123")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </Link>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900">Welcome Back!</h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Sign in to access your dashboard and manage your home services with trusted professionals.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Why Choose ServiceHub?</h3>
            <div className="space-y-3">
              {[
                "Verified & trusted professionals",
                "24/7 customer support",
                "Transparent pricing",
                "Quality guarantee",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-8">
              <div className="text-center lg:hidden">
                <Link href="/" className="inline-flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ServiceHub
                  </span>
                </Link>
              </div>

              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900">Sign In</CardTitle>
                <CardDescription className="text-slate-600 mt-2">
                  Enter your credentials to access your account
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <Separator className="my-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge variant="secondary" className="bg-white px-3 text-slate-500">
                    Demo Accounts
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {demoAccounts.map((account, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 border-2 hover:border-blue-500 rounded-xl"
                    onClick={() => handleDemoLogin(account.email)}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${account.color}`}>
                        <account.icon className="h-4 w-4" />
                      </div>
                      <div className="text-xs font-medium text-slate-700">{account.type}</div>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="text-center pt-4">
                <span className="text-slate-600">Don't have an account? </span>
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
