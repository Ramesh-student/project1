"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Database,
  Shield,
  BarChart3,
  Activity,
  Zap,
  Wrench,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalCustomers: number
  totalProviders: number
  totalAdmins: number
  totalRequests: number
  pendingRequests: number
  completedRequests: number
  electricianRequests: number
  plumberRequests: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCustomers: 0,
    totalProviders: 0,
    totalAdmins: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    electricianRequests: 0,
    plumberRequests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()

    // Check for last backup time
    if (typeof window !== "undefined") {
      const savedTime = localStorage.getItem("servicehub_backup_time")
      if (savedTime) {
        setLastBackupTime(savedTime)
      }
    }
  }, [])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      // Fetch user statistics
      const { data: users, error: usersError } = await supabase.from("users").select("user_type")

      if (usersError) throw usersError

      const totalUsers = users.length
      const totalCustomers = users.filter((user) => user.user_type === "customer").length
      const totalProviders = users.filter((user) => user.user_type === "provider").length
      const totalAdmins = users.filter((user) => user.user_type === "admin").length

      // Fetch service request statistics
      const { data: requests, error: requestsError } = await supabase
        .from("service_requests")
        .select("status, service_type")

      if (requestsError) throw requestsError

      const totalRequests = requests.length
      const pendingRequests = requests.filter((req) =>
        ["pending", "accepted", "payment_pending", "in_progress"].includes(req.status),
      ).length
      const completedRequests = requests.filter((req) => req.status === "completed").length
      const electricianRequests = requests.filter((req) => req.service_type === "electrician").length
      const plumberRequests = requests.filter((req) => req.service_type === "plumber").length

      setStats({
        totalUsers,
        totalCustomers,
        totalProviders,
        totalAdmins,
        totalRequests,
        pendingRequests,
        completedRequests,
        electricianRequests,
        plumberRequests,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      // Set mock data for demo
      setStats({
        totalUsers: 15,
        totalCustomers: 10,
        totalProviders: 4,
        totalAdmins: 1,
        totalRequests: 8,
        pendingRequests: 3,
        completedRequests: 5,
        electricianRequests: 5,
        plumberRequests: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome to the ServiceHub admin panel</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</p>
              </div>
              <div className="p-2 bg-blue-900/30 rounded-full">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Service Requests</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.totalRequests}</p>
              </div>
              <div className="p-2 bg-purple-900/30 rounded-full">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.pendingRequests}</p>
              </div>
              <div className="p-2 bg-yellow-900/30 rounded-full">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed Services</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.completedRequests}</p>
              </div>
              <div className="p-2 bg-green-900/30 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Distribution */}
        <Card className="bg-gray-900 border-gray-800 text-white md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              User Distribution
            </CardTitle>
            <CardDescription className="text-gray-400">Breakdown of user types in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.totalCustomers}</span>
                  <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800">
                    {stats.totalUsers > 0 ? Math.round((stats.totalCustomers / stats.totalUsers) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Service Providers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.totalProviders}</span>
                  <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-800">
                    {stats.totalUsers > 0 ? Math.round((stats.totalProviders / stats.totalUsers) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Admins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.totalAdmins}</span>
                  <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
                    {stats.totalUsers > 0 ? Math.round((stats.totalAdmins / stats.totalUsers) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              {/* Progress bar visualization */}
              <div className="h-2 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="flex h-full">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.totalCustomers / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.totalProviders / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                  <div
                    className="bg-yellow-500 h-full"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.totalAdmins / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Type Distribution */}
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
              Service Distribution
            </CardTitle>
            <CardDescription className="text-gray-400">Breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-300">Electrician</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.electricianRequests}</span>
                  <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
                    {stats.totalRequests > 0 ? Math.round((stats.electricianRequests / stats.totalRequests) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-300">Plumber</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{stats.plumberRequests}</span>
                  <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800">
                    {stats.totalRequests > 0 ? Math.round((stats.plumberRequests / stats.totalRequests) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              {/* Progress bar visualization */}
              <div className="h-2 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="flex h-full">
                  <div
                    className="bg-yellow-500 h-full"
                    style={{
                      width: `${stats.totalRequests > 0 ? (stats.electricianRequests / stats.totalRequests) * 100 : 0}%`,
                    }}
                  ></div>
                  <div
                    className="bg-blue-500 h-full"
                    style={{
                      width: `${stats.totalRequests > 0 ? (stats.plumberRequests / stats.totalRequests) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center border-gray-800 hover:border-gray-700 hover:bg-gray-800"
              >
                <Users className="h-6 w-6 mb-2 text-blue-400" />
                <span className="text-sm font-medium">Manage Users</span>
              </Button>
            </Link>

            <Link href="/admin/database">
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center border-gray-800 hover:border-gray-700 hover:bg-gray-800"
              >
                <Database className="h-6 w-6 mb-2 text-purple-400" />
                <span className="text-sm font-medium">Database Tools</span>
              </Button>
            </Link>

            <Link href="/admin/admins">
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center border-gray-800 hover:border-gray-700 hover:bg-gray-800"
              >
                <Shield className="h-6 w-6 mb-2 text-yellow-400" />
                <span className="text-sm font-medium">Admin Accounts</span>
              </Button>
            </Link>

            <Link href="/database-backup">
              <Button
                variant="outline"
                className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center border-gray-800 hover:border-gray-700 hover:bg-gray-800"
              >
                <Save className="h-6 w-6 mb-2 text-green-400" />
                <span className="text-sm font-medium">Backup Data</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Database Backup Status */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <Save className="h-5 w-5 mr-2 text-green-400" />
            Database Backup Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {lastBackupTime ? (
                <>
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" /> Backup Available
                  </Badge>
                  <span className="text-sm text-gray-300">Last backup: {lastBackupTime}</span>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
                    <AlertCircle className="h-3 w-3 mr-1" /> No Recent Backup
                  </Badge>
                  <span className="text-sm text-gray-300">No backup found</span>
                </>
              )}
            </div>

            <Link href="/database-backup">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                {lastBackupTime ? "Manage Backups" : "Create Backup"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
