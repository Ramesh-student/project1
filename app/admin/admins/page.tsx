"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Shield, Plus, Search, MoreHorizontal, Edit, Trash2, UserCheck, Calendar, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface AdminUser {
  id: string
  email: string
  full_name: string
  phone: string
  address: string
  description: string
  created_at: string
  last_sign_in?: string
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_type", "admin")
        .order("created_at", { ascending: false })

      if (error) throw error

      setAdmins(data || [])
    } catch (error) {
      console.error("Error fetching admins:", error)
      // For demo purposes, show mock data
      setAdmins([
        {
          id: "mock-admin-1",
          email: "admin@servicehub.com",
          full_name: "System Administrator",
          phone: "+1234567890",
          address: "123 Admin Street, Admin City",
          description: "Main system administrator",
          created_at: new Date().toISOString(),
          last_sign_in: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin account? This action cannot be undone.")) {
      return
    }

    try {
      // In a real app, you'd want to:
      // 1. Check if this is the last admin (prevent lockout)
      // 2. Log the deletion action
      // 3. Handle the auth.users deletion as well

      const { error } = await supabase.from("users").delete().eq("id", adminId)

      if (error) throw error

      // Log the action
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("admin_activity_log").insert({
          admin_id: user.id,
          action_type: "admin_deleted",
          action_details: { deleted_admin_id: adminId },
          ip_address: "client_ip",
        })
      }

      alert("Admin account deleted successfully")
      fetchAdmins()
    } catch (error: any) {
      console.error("Error deleting admin:", error)
      alert("Error deleting admin account: " + error.message)
    }
  }

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Management</h1>
          <p className="text-gray-400">Manage administrator accounts and permissions</p>
        </div>
        <Link href="/auth/admin/signup">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Admin
          </Button>
        </Link>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800 text-white md:col-span-3">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search administrators..."
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Admins</p>
                <p className="text-2xl font-bold">{loading ? "..." : admins.length}</p>
              </div>
              <div className="p-2 bg-blue-900/30 rounded-full">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin List */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-400" />
            Administrator Accounts
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage system administrators and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchQuery ? "No administrators found matching your search." : "No administrators found."}
              </p>
              {!searchQuery && (
                <Link href="/auth/admin/signup">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Admin
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAdmins.map((admin) => (
                <div key={admin.id} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="font-semibold text-white">{admin.full_name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-white">{admin.full_name}</h3>
                          <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {admin.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {admin.phone}
                          </div>
                          {admin.description && (
                            <div className="flex items-center">
                              <UserCheck className="h-4 w-4 mr-2" />
                              {admin.description}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Created: {new Date(admin.created_at).toLocaleDateString()}
                          </div>
                          {admin.last_sign_in && (
                            <div className="flex items-center">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Last login: {new Date(admin.last_sign_in).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-900/30"
                          onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-yellow-900/20 border-yellow-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-400 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-yellow-200">
            <p>• Always use strong passwords for admin accounts</p>
            <p>• Regularly review admin access and remove unused accounts</p>
            <p>• Monitor admin activity logs for suspicious behavior</p>
            <p>• Ensure at least one admin account is always active to prevent lockout</p>
            <p>• Use the admin signup key responsibly and change it periodically</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
