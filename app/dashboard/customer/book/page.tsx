"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Zap, Wrench } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function BookServicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceType = searchParams.get("service") || "electrician"

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    problemDescription: "",
    preferredDate: "",
    preferredTime: "",
    customerAddress: "",
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Get user address
    const { data: profile } = await supabase.from("users").select("address").eq("id", user.id).single()

    if (profile) {
      setFormData((prev) => ({ ...prev, customerAddress: profile.address }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      let imageUrl = null

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("service-images")
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("service-images").getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Create service request
      const { error } = await supabase.from("service_requests").insert({
        customer_id: user.id,
        service_type: serviceType,
        problem_description: formData.problemDescription,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        customer_address: formData.customerAddress,
        problem_image_url: imageUrl,
        status: "pending",
      })

      if (error) throw error

      alert("Service request submitted successfully!")
      router.push("/dashboard/customer")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center mb-2">
            {serviceType === "electrician" ? (
              <Zap className="h-8 w-8 text-yellow-500 mr-3" />
            ) : (
              <Wrench className="h-8 w-8 text-blue-500 mr-3" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 capitalize">Book {serviceType} Service</h1>
          </div>
          <p className="text-gray-600">Fill out the form to request a service</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Request Form</CardTitle>
            <CardDescription>Please provide details about your {serviceType} service requirement</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problemDescription">Problem Description *</Label>
                <Textarea
                  id="problemDescription"
                  placeholder={`Describe your ${serviceType} problem in detail...`}
                  required
                  value={formData.problemDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, problemDescription: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemImage">Upload Problem Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="problemImage" className="cursor-pointer text-blue-600 hover:text-blue-500">
                      Click to upload an image
                    </Label>
                    <Input
                      id="problemImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  {imageFile && <p className="mt-2 text-sm text-green-600">Selected: {imageFile.name}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time *</Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preferredTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerAddress">Service Address *</Label>
                <Textarea
                  id="customerAddress"
                  placeholder="Enter complete address where service is required..."
                  required
                  value={formData.customerAddress}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerAddress: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Service Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Visiting charges: ₹500 (to be paid after service provider accepts)</li>
                  <li>• Service provider will contact you after accepting the request</li>
                  <li>• Payment required before service provider visits</li>
                  <li>• UPI ID for payment: rameshp333777@oksbi</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting Request..." : "Submit Service Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
