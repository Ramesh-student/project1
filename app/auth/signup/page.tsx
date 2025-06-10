"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff, Users, Wrench, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
    location: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type")

  const userTypes = [
    { value: "customer", label: "Customer", icon: Users, description: "Book home services" },
    { value: "electrician", label: "Electrician", icon: Zap, description: "Provide electrical services" },
    { value: "plumber", label: "Plumber", icon: Wrench, description: "Provide plumbing services" },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError("Please fill in all required fields")
        return
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
      if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        setError("Please enter a valid 10-digit phone number")
        return
      }
    }

    if (step === 2) {
      if (!formData.userType || !formData.location) {
        setError("Please select user type and location")
        return
      }
    }

    setError("")
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate signup logic
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect based on user type
      switch (formData.userType) {
        case "customer":
          router.push("/dashboard/customer")
          break
        case "electrician":
          router.push("/dashboard/electrician")
          break
        case "plumber":
          router.push("/dashboard/plumber")
          break
        default:
          router.push("/auth/login")
      }
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
              <h1 className="text-4xl font-bold text-slate-900">Join ServiceHub Today</h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Create your account and connect with thousands of customers or find trusted professionals for your home
                services.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Getting Started is Easy</h3>
            <div className="space-y-4">
              {[
                { step: "1", title: "Create Account", desc: "Fill in your basic information" },
                { step: "2", title: "Choose Role", desc: "Select customer or service provider" },
                { step: "3", title: "Start Using", desc: "Book services or accept requests" },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      Number.parseInt(item.step) <= step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {Number.parseInt(item.step) < step ? <CheckCircle className="h-4 w-4" /> : item.step}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
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
                <CardTitle className="text-2xl font-bold text-slate-900">Create Account</CardTitle>
                <CardDescription className="text-slate-600 mt-2">
                  Step {step} of 3 - {step === 1 ? "Personal Information" : step === 2 ? "Account Type" : "Security"}
                </CardDescription>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                          required
                        />
                      </div>
                    </div>

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
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700 font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Account Type & Location */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-slate-700 font-medium">I want to...</Label>
                      <div className="grid gap-3">
                        {userTypes.map((type) => (
                          <div
                            key={type.value}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              formData.userType === type.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => handleInputChange("userType", type.value)}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  formData.userType === type.value
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <type.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{type.label}</div>
                                <div className="text-sm text-slate-600">{type.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-700 font-medium">
                        Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Select
                          value={formData.location}
                          onValueChange={(value) => handleInputChange("location", value)}
                        >
                          <SelectTrigger className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl">
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                            <SelectItem value="hyderabad">Hyderabad</SelectItem>
                            <SelectItem value="chennai">Chennai</SelectItem>
                            <SelectItem value="kolkata">Kolkata</SelectItem>
                            <SelectItem value="pune">Pune</SelectItem>
                            <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Security */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-700 font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="pl-10 pr-10 h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 pt-4">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex space-x-3 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 h-12 border-2 border-slate-300 hover:border-slate-400 rounded-xl"
                    >
                      Back
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Create Account</span>
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </form>

              <div className="text-center pt-4">
                <span className="text-slate-600">Already have an account? </span>
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
