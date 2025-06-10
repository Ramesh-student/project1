import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Globe, Key, Folder } from "lucide-react"

export function ProjectInfo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase Project Configuration</h1>
        <p className="text-gray-600">Your ServiceHub project setup details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Details */}
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Project Information</CardTitle>
            </div>
            <CardDescription>Your Supabase project details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                Recommended
              </Badge>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Project Name:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">servicehub-ecommerce</code>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Database:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">postgres</code>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Schema:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">public</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Tables */}
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Database Tables</CardTitle>
            </div>
            <CardDescription>Tables in your public schema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="font-mono text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <code>public.users</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <code>public.service_requests</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <code>public.payments</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <code>public.reviews</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <code>auth.users</code> <span className="text-xs text-gray-500">(system)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">API Configuration</CardTitle>
            </div>
            <CardDescription>Your project API details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-sm">Project URL:</span>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                  https://[your-project-id].supabase.co
                </div>
              </div>
              <div>
                <span className="font-medium text-sm">Database Host:</span>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">db.[your-project-id].supabase.co</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Configuration */}
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Storage Buckets</CardTitle>
            </div>
            <CardDescription>File storage configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div>
                <Badge variant="outline" className="mb-2">
                  Required
                </Badge>
                <div className="font-mono text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <code>service-images</code>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <p>• Public bucket for problem images</p>
                <p>• Accepts: JPG, PNG, GIF</p>
                <p>• Max size: 10MB per file</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">🚀 How to Find Your Project Name</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">In Supabase Dashboard:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>
                  1. Go to <code className="bg-blue-100 px-1 rounded">supabase.com/dashboard</code>
                </p>
                <p>2. Your project name appears in the project list</p>
                <p>3. Click on your project to see the full details</p>
                <p>4. Project name is shown in the top-left corner</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-2">In Project Settings:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p>
                  1. <code className="bg-blue-100 px-1 rounded">Dashboard → Settings → General</code>
                </p>
                <p>2. See "Project name" field</p>
                <p>3. See "Reference ID" (used in URLs)</p>
                <p>4. See "Region" and other details</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Current Project Status</CardTitle>
          <CardDescription>What you should see in your Supabase dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">✅ If Setup Complete:</h4>
              <ul className="text-sm space-y-1 text-green-700">
                <li>• Project name: servicehub-ecommerce</li>
                <li>• 4-5 tables in Table Editor</li>
                <li>• service-images bucket in Storage</li>
                <li>• Environment variables configured</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚠️ If Still Setting Up:</h4>
              <ul className="text-sm space-y-1 text-orange-700">
                <li>• Choose project name during creation</li>
                <li>• Run database setup SQL script</li>
                <li>• Create storage bucket</li>
                <li>• Copy API keys to .env.local</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
