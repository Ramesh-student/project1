import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Users, FileText, CreditCard, Star, ImageIcon } from "lucide-react"

export function DatabaseViewer() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Structure Overview</h1>
        <p className="text-gray-600">Understanding your ServiceHub database tables</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Table */}
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">users</CardTitle>
            </div>
            <CardDescription>Customer & provider profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Primary Table
              </Badge>
              <div className="text-sm space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>• id (UUID)</div>
                  <div>• email</div>
                  <div>• full_name</div>
                  <div>• user_type</div>
                  <div>• service_type</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Requests Table */}
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">service_requests</CardTitle>
            </div>
            <CardDescription>All service bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Core Table
              </Badge>
              <div className="text-sm space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>• id (UUID)</div>
                  <div>• customer_id</div>
                  <div>• service_type</div>
                  <div>• status</div>
                  <div>• problem_description</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">payments</CardTitle>
            </div>
            <CardDescription>Payment transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
              <div className="text-sm space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>• id (UUID)</div>
                  <div>• request_id</div>
                  <div>• amount</div>
                  <div>• payment_method</div>
                  <div>• status</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card className="border-yellow-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">reviews</CardTitle>
            </div>
            <CardDescription>Customer feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
              <div className="text-sm space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>• id (UUID)</div>
                  <div>• request_id</div>
                  <div>• rating (1-5)</div>
                  <div>• comment</div>
                  <div>• customer_id</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Bucket */}
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">service-images</CardTitle>
            </div>
            <CardDescription>Image storage bucket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                Storage
              </Badge>
              <div className="text-sm space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>• Public bucket</div>
                  <div>• Problem images</div>
                  <div>• JPG, PNG files</div>
                  <div>• Auto-generated URLs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Users */}
        <Card className="border-indigo-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg">auth.users</CardTitle>
            </div>
            <CardDescription>Supabase authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">
                System Table
              </Badge>
              <div className="text-sm space-y-1">
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  <div>• id (UUID)</div>
                  <div>• email</div>
                  <div>• email_confirmed</div>
                  <div>• created_at</div>
                  <div>• last_sign_in</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Instructions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">🧭 How to Access in Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">📊 View Tables</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="bg-blue-100 p-2 rounded font-mono text-xs">Dashboard → Table Editor</div>
                <p>• Click any table name to view data</p>
                <p>• Use Insert/Edit/Delete buttons</p>
                <p>• Apply filters to find specific records</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-3">🖼️ View Storage</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="bg-blue-100 p-2 rounded font-mono text-xs">Dashboard → Storage → service-images</div>
                <p>• See uploaded problem images</p>
                <p>• Download or delete files</p>
                <p>• Monitor storage usage</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Sample Data Preview</CardTitle>
          <CardDescription>What your tables will look like with real data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">users table:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-2">email</th>
                      <th className="border p-2">full_name</th>
                      <th className="border p-2">user_type</th>
                      <th className="border p-2">service_type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">john@email.com</td>
                      <td className="border p-2">John Doe</td>
                      <td className="border p-2">customer</td>
                      <td className="border p-2">null</td>
                    </tr>
                    <tr>
                      <td className="border p-2">mike@email.com</td>
                      <td className="border p-2">Mike Smith</td>
                      <td className="border p-2">provider</td>
                      <td className="border p-2">electrician</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">service_requests table:</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-2">service_type</th>
                      <th className="border p-2">problem_description</th>
                      <th className="border p-2">status</th>
                      <th className="border p-2">visiting_charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">electrician</td>
                      <td className="border p-2">Power outlet not working</td>
                      <td className="border p-2">pending</td>
                      <td className="border p-2">500.00</td>
                    </tr>
                    <tr>
                      <td className="border p-2">plumber</td>
                      <td className="border p-2">Leaking kitchen faucet</td>
                      <td className="border p-2">completed</td>
                      <td className="border p-2">500.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
