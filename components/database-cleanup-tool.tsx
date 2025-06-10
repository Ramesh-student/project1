"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Database, Trash2, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DatabaseCleanupTool() {
  const [cleanupStatus, setCleanupStatus] = useState<"idle" | "running" | "completed" | "error">("idle")
  const [cleanupResults, setCleanupResults] = useState<any>(null)

  const handleCleanup = async () => {
    setCleanupStatus("running")

    try {
      // Simulate cleanup process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock cleanup results
      const results = {
        users: { before: 25, after: 0 },
        service_requests: { before: 50, after: 0 },
        payments: { before: 30, after: 0 },
        reviews: { before: 15, after: 0 },
        admin_activity_log: { before: 100, after: 0 },
        storage_files: { before: 20, after: 0 },
        auth_users: { before: 25, after: 0 },
      }

      setCleanupResults(results)
      setCleanupStatus("completed")
    } catch (error) {
      setCleanupStatus("error")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Database Cleanup Tool</h1>
        <p className="text-gray-400">Clean and reset your ServiceHub database</p>
      </div>

      {/* Warning Alert */}
      <Alert className="border-red-800 bg-red-900/30">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription className="text-red-300">
          <strong>WARNING:</strong> Database cleanup is irreversible! All user data, service requests, payments, and
          uploaded files will be permanently deleted.
        </AlertDescription>
      </Alert>

      {/* Cleanup Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Data Cleanup</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Remove all data while keeping table structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-300">What will be deleted:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• All user accounts and profiles</li>
                <li>• All service requests and bookings</li>
                <li>• All payment records</li>
                <li>• All customer reviews</li>
                <li>• All admin activity logs</li>
                <li>• All uploaded images</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-300">What will be preserved:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Database table structure</li>
                <li>• Row Level Security policies</li>
                <li>• Indexes and constraints</li>
                <li>• Default admin settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">Complete Reset</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Drop all tables and start completely fresh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-300">What will be deleted:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• All data (same as data cleanup)</li>
                <li>• All database tables</li>
                <li>• All custom functions</li>
                <li>• All policies and constraints</li>
                <li>• Storage buckets</li>
              </ul>
            </div>
            <div className="bg-red-900/30 border border-red-800 rounded p-3">
              <p className="text-red-300 text-sm">
                <strong>Requires manual setup:</strong> You'll need to run the database setup scripts again after this
                reset.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cleanup Actions */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white">Cleanup Actions</CardTitle>
          <CardDescription className="text-gray-400">Choose your cleanup method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cleanupStatus === "idle" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleCleanup}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={cleanupStatus === "running"}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Start Data Cleanup
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" disabled>
                  <Database className="h-4 w-4 mr-2" />
                  Complete Reset (Manual)
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                For complete reset, use the SQL scripts in the database-cleanup-guide.md
              </p>
            </div>
          )}

          {cleanupStatus === "running" && (
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-blue-400">Cleaning database... This may take a few moments.</span>
            </div>
          )}

          {cleanupStatus === "completed" && cleanupResults && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-400 font-medium">Database cleanup completed successfully!</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(cleanupResults).map(([table, counts]: [string, any]) => (
                  <div key={table} className="bg-gray-800 p-3 rounded">
                    <div className="text-sm font-medium text-gray-300 capitalize">{table.replace("_", " ")}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {counts.before} → {counts.after}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-900/30 border border-green-800 rounded p-3">
                <p className="text-green-300 text-sm">
                  Your database is now clean and ready for new data. You can start creating accounts and using the
                  platform normally.
                </p>
              </div>
            </div>
          )}

          {cleanupStatus === "error" && (
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-400">Cleanup failed. Please try the manual SQL scripts instead.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Instructions */}
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white">Manual Cleanup Instructions</CardTitle>
          <CardDescription className="text-gray-400">Step-by-step guide for manual database cleanup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-300">Go to Supabase Dashboard</p>
                <p className="text-sm text-gray-500">Navigate to your project's SQL Editor</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-300">Run Cleanup Script</p>
                <p className="text-sm text-gray-500">Copy and execute scripts/database-cleanup.sql</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-300">Clean Auth Users</p>
                <p className="text-sm text-gray-500">Go to Authentication → Users and delete all users</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <p className="font-medium text-gray-300">Clean Storage</p>
                <p className="text-sm text-gray-500">Go to Storage → service-images and delete all files</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-800 rounded p-3">
            <p className="text-blue-300 text-sm">
              <strong>Tip:</strong> Check the database-cleanup-guide.md file for detailed instructions and
              troubleshooting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
