import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Key, Upload, Play } from "lucide-react"

export function SetupInstructions() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">ServiceHub Setup Guide</h1>
        <p className="text-gray-600">Get your e-commerce platform running in minutes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">1. Create Supabase Project</CardTitle>
            </div>
            <CardDescription>Set up your database and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm">
                • Go to{" "}
                <a
                  href="https://supabase.com"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  supabase.com
                </a>
              </p>
              <p className="text-sm">• Create a new project</p>
              <p className="text-sm">• Note your Project URL and API keys</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">2. Configure Environment</CardTitle>
            </div>
            <CardDescription>Add your Supabase credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
              <div>NEXT_PUBLIC_SUPABASE_URL=your-url</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key</div>
              <div>SUPABASE_SERVICE_ROLE_KEY=your-service-key</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">3. Run Database Setup</CardTitle>
            </div>
            <CardDescription>Execute the SQL schema script</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm">• Copy SQL from scripts/database-setup.sql</p>
              <p className="text-sm">• Run in Supabase SQL Editor</p>
              <p className="text-sm">• Create 'service-images' storage bucket</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">4. Launch Application</CardTitle>
            </div>
            <CardDescription>Start your development server</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
              <div>npm install</div>
              <div>npm run dev</div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Ready in 2 minutes!
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">🎉 What You Get</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Customer Features</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Service booking</li>
                <li>• Request tracking</li>
                <li>• Payment integration</li>
                <li>• Image uploads</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Provider Features</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Request management</li>
                <li>• Customer contact</li>
                <li>• Status updates</li>
                <li>• Earnings tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Admin Features</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• User management</li>
                <li>• Service oversight</li>
                <li>• Payment monitoring</li>
                <li>• Analytics dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
