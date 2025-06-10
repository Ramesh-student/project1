"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wrench, LogOut, User, CheckCircle, Clock, MapPin, Calendar, CreditCard, Smartphone, Copy } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ServiceRequest {
  id: string
  customer_id: string
  problem_description: string
  preferred_date: string
  preferred_time: string
  customer_address: string
  problem_image_url?: string
  status: string
  created_at: string
  users?: {
    full_name: string
    phone: string
    email: string
  }
}

export default function PlumberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)

  useEffect(() => {
    checkUser()
    fetchRequests()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

      // For demo purposes, allow access even if profile doesn't match
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        setUser({
          id: user.id,
          full_name: "Demo Plumber",
          user_type: "provider",
          service_type: "plumber",
          email: user.email,
        })
        setLoading(false)
        return
      }

      if (profile?.user_type !== "provider" || profile?.service_type !== "plumber") {
        router.push("/auth/login")
        return
      }

      setUser(profile)
      setLoading(false)
    } catch (error) {
      console.error("Error checking user:", error)
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          users:customer_id (
            full_name,
            phone,
            email
          )
        `)
        .eq("service_type", "plumber")
        .in("status", ["pending", "accepted", "payment_pending", "in_progress"])
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching requests:", error)
        return
      }

      if (data) {
        console.log("Fetched service requests:", data)
        setRequests(data)
      }
    } catch (error) {
      console.error("Error in fetchRequests:", error)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from("service_requests")
        .update({
          status: "payment_pending",
          provider_id: user.id,
        })
        .eq("id", requestId)

      if (error) throw error

      alert("Request accepted! Customer will be notified to make payment.")
      fetchRequests()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleMarkCompleted = async (requestId: string) => {
    try {
      const { error } = await supabase.from("service_requests").update({ status: "completed" }).eq("id", requestId)

      if (error) throw error

      alert("Service marked as completed!")
      fetchRequests()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handlePaymentReceived = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({
          status: "in_progress",
          payment_received: true,
          payment_date: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (error) throw error

      alert("Payment confirmed! Service is now in progress.")
      fetchRequests()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleUPIPayment = (request: ServiceRequest) => {
    const upiId = "rameshp333777@oksbi"
    const amount = "500"
    const merchantName = "ServiceHub"
    const transactionNote = `Payment for service request ${request.id}`

    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`

    // Try to open UPI app
    if (typeof window !== "undefined") {
      // For mobile devices, try to open UPI app
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = upiUrl

        // Show confirmation dialog after a delay
        setTimeout(() => {
          const confirmed = confirm("Have you completed the payment? Click OK if payment is successful.")
          if (confirmed) {
            handlePaymentReceived(request.id)
            setPaymentDialogOpen(false)
          }
        }, 3000)
      } else {
        // For desktop, show QR code and payment details
        setSelectedRequest(request)
        setPaymentDialogOpen(true)
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const generateQRCodeUrl = (request: ServiceRequest) => {
    const upiId = "rameshp333777@oksbi"
    const amount = "500"
    const merchantName = "ServiceHub"
    const transactionNote = `Payment for service request ${request.id}`

    const upiString = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`

    // Using QR Server API to generate QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "payment_pending":
        return "bg-orange-100 text-orange-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">ServiceHub - Plumber</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{user?.full_name || "Demo Plumber"}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Plumber Dashboard</h2>
          <p className="text-gray-600">Manage your plumbing service requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</p>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "accepted").length}</p>
                  <p className="text-sm text-gray-600">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "in_progress").length}</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "completed").length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Plumbing Service Requests</CardTitle>
            <CardDescription>Available requests from customers</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No service requests available at the moment.</p>
            ) : (
              <div className="space-y-6">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <Wrench className="h-6 w-6 text-blue-500" />
                        <div>
                          <h3 className="font-semibold text-lg">Plumbing Service Request</h3>
                          <p className="text-gray-600">Customer: {request.users?.full_name || "Unknown Customer"}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">Problem Description:</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{request.problem_description}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {new Date(request.preferred_date).toLocaleDateString()} at {request.preferred_time}
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                          <span className="text-sm">{request.customer_address}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Phone: {request.users?.phone || "Not provided"}</p>
                          <p>Email: {request.users?.email || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    {request.problem_image_url && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Problem Image:</h4>
                        <img
                          src={request.problem_image_url || "/placeholder.svg"}
                          alt="Problem"
                          className="max-w-xs rounded border"
                        />
                      </div>
                    )}

                    <div className="flex space-x-3">
                      {request.status === "pending" && (
                        <Button onClick={() => handleAcceptRequest(request.id)}>Accept Request</Button>
                      )}
                      {request.status === "payment_pending" && (
                        <div className="bg-orange-50 border border-orange-200 rounded p-4 flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-orange-800 font-medium flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Payment Required
                              </p>
                              <p className="text-orange-700 text-sm">Customer needs to pay ₹500 visiting charges</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleUPIPayment(request)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <Smartphone className="h-4 w-4 mr-2" />
                              Pay via UPI
                            </Button>
                            <Button onClick={() => handlePaymentReceived(request.id)} variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </Button>
                          </div>
                        </div>
                      )}
                      {(request.status === "accepted" || request.status === "in_progress") && (
                        <Button onClick={() => handleMarkCompleted(request.id)} variant="outline">
                          Mark as Completed
                        </Button>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Requested on: {new Date(request.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>UPI Payment</DialogTitle>
              <DialogDescription>Scan the QR code or use the payment details below</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                {/* QR Code */}
                <div className="flex justify-center">
                  <img
                    src={generateQRCodeUrl(selectedRequest) || "/placeholder.svg"}
                    alt="UPI QR Code"
                    className="w-48 h-48 border rounded"
                  />
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">UPI ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">rameshp333777@oksbi</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard("rameshp333777@oksbi")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Amount:</span>
                    <span className="text-sm font-bold">₹500</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Reference:</span>
                    <span className="text-sm">Service #{selectedRequest.id}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button onClick={() => handlePaymentReceived(selectedRequest.id)} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payment Completed
                  </Button>
                  <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have any questions or need assistance, please contact our support team.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Email:</span>
              <a href="mailto:support@servicehub.com" className="text-blue-600 hover:underline">
                support@servicehub.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
