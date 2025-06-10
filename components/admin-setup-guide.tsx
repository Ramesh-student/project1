import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Key, UserPlus, Database, CheckCircle } from "lucide-react"
import Link from "next/link"

export function AdminSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Admin Setup Guide</h1>
        <p className="text-gray-400">Set up your first administrator account for ServiceHub</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">1. Admin Signup Key</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Use the special key to create admin accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">Demo Admin Key:</p>
              <code className="text-blue-400 bg-gray-700 px-2 py-1 rounded text-sm">SERVICEHUB_ADMIN_2024</code>
            </div>
            <div className="text-sm text-gray-400">
              <p>• This key is required for admin account creation</p>
              <p>• In production, use a secure, unique key</p>
              <p>• Store the key securely and share only with trusted users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">2. Create Admin Account</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Set up your administrator profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/auth/admin/signup">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Shield className="h-4 w-4 mr-2" />
                Create Admin Account
              </Button>
            </Link>
            <div className="text-sm text-gray-400">
              <p>• Use a strong, unique password</p>
              <p>• Provide accurate contact information</p>
              <p>• Add a descriptive role description</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">3. Database Access</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Verify database setup and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-300">Admin tables created</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-300">Row Level Security enabled</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-300">Activity logging configured</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">4. Access Admin Panel</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Login and start managing your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/auth/admin/login">
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                <Shield className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            </Link>
            <div className="text-sm text-gray-400">
              <p>• Full database access and monitoring</p>
              <p>• User and service management</p>
              <p>• System configuration and logs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl text-blue-300">🔐 Admin Features Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">User Management</h4>
              <ul className="space-y-1 text-blue-200">
                <li>• View all customers and providers</li>
                <li>• Monitor user activity</li>
                <li>• Manage user accounts</li>
                <li>• Track registrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Service Monitoring</h4>
              <ul className="space-y-1 text-blue-200">
                <li>• Track all service requests</li>
                <li>• Monitor payment status</li>
                <li>• View service analytics</li>
                <li>• Manage disputes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">System Control</h4>
              <ul className="space-y-1 text-blue-200">
                <li>• Database explorer</li>
                <li>• Activity logs</li>
                <li>• System settings</li>
                <li>• Storage management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-900/20 border-yellow-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-400">⚠️ Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-200">
            <div>
              <h4 className="font-semibold mb-2">Account Security</h4>
              <ul className="space-y-1">
                <li>• Use strong, unique passwords</li>
                <li>• Enable two-factor authentication (when available)</li>
                <li>• Regularly update passwords</li>
                <li>• Don't share admin credentials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Access Control</h4>
              <ul className="space-y-1">
                <li>• Limit admin accounts to necessary personnel</li>
                <li>• Regularly review admin access</li>
                <li>• Monitor admin activity logs</li>
                <li>• Remove unused admin accounts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
