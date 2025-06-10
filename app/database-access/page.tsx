"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  Table,
  Users,
  FileText,
  CreditCard,
  Star,
  Settings,
  Activity,
  Search,
  Eye,
  Download,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TableInfo {
  name: string
  schema: string
  description: string
  icon: any
  rowCount: number
  columns: Array<{
    name: string
    type: string
    nullable: boolean
    isPrimary: boolean
    description: string
  }>
}

export default function DatabaseAccessPage() {
  const [selectedTable, setSelectedTable] = useState<string>("users")
  const [tableData, setTableData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Database tables configuration
  const tables: TableInfo[] = [
    {
      name: "users",
      schema: "public",
      description: "All user profiles (customers, providers, admins)",
      icon: Users,
      rowCount: 0,
      columns: [
        { name: "id", type: "UUID", nullable: false, isPrimary: true, description: "Unique user identifier" },
        { name: "email", type: "VARCHAR(255)", nullable: false, isPrimary: false, description: "User email address" },
        { name: "full_name", type: "VARCHAR(255)", nullable: false, isPrimary: false, description: "User's full name" },
        { name: "phone", type: "VARCHAR(20)", nullable: false, isPrimary: false, description: "Phone number" },
        { name: "address", type: "TEXT", nullable: false, isPrimary: false, description: "User address" },
        {
          name: "user_type",
          type: "VARCHAR(20)",
          nullable: false,
          isPrimary: false,
          description: "customer, provider, admin",
        },
        {
          name: "service_type",
          type: "VARCHAR(20)",
          nullable: true,
          isPrimary: false,
          description: "electrician, plumber (for providers)",
        },
        {
          name: "experience",
          type: "INTEGER",
          nullable: true,
          isPrimary: false,
          description: "Years of experience (providers)",
        },
        {
          name: "description",
          type: "TEXT",
          nullable: true,
          isPrimary: false,
          description: "Service description (providers)",
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          nullable: false,
          isPrimary: false,
          description: "Account creation date",
        },
        { name: "updated_at", type: "TIMESTAMP", nullable: false, isPrimary: false, description: "Last update date" },
      ],
    },
    {
      name: "service_requests",
      schema: "public",
      description: "All service booking requests",
      icon: FileText,
      rowCount: 0,
      columns: [
        { name: "id", type: "UUID", nullable: false, isPrimary: true, description: "Unique request identifier" },
        {
          name: "customer_id",
          type: "UUID",
          nullable: false,
          isPrimary: false,
          description: "Customer who made request",
        },
        {
          name: "provider_id",
          type: "UUID",
          nullable: true,
          isPrimary: false,
          description: "Assigned service provider",
        },
        {
          name: "service_type",
          type: "VARCHAR(20)",
          nullable: false,
          isPrimary: false,
          description: "electrician or plumber",
        },
        {
          name: "problem_description",
          type: "TEXT",
          nullable: false,
          isPrimary: false,
          description: "Description of the problem",
        },
        {
          name: "problem_image_url",
          type: "TEXT",
          nullable: true,
          isPrimary: false,
          description: "URL to uploaded problem image",
        },
        {
          name: "preferred_date",
          type: "DATE",
          nullable: false,
          isPrimary: false,
          description: "Customer's preferred service date",
        },
        {
          name: "preferred_time",
          type: "TIME",
          nullable: false,
          isPrimary: false,
          description: "Customer's preferred service time",
        },
        {
          name: "customer_address",
          type: "TEXT",
          nullable: false,
          isPrimary: false,
          description: "Service location address",
        },
        {
          name: "status",
          type: "VARCHAR(20)",
          nullable: false,
          isPrimary: false,
          description: "pending, accepted, payment_pending, in_progress, completed, cancelled",
        },
        {
          name: "visiting_charges",
          type: "DECIMAL(10,2)",
          nullable: false,
          isPrimary: false,
          description: "Service visiting charges (default: 500)",
        },
        {
          name: "total_amount",
          type: "DECIMAL(10,2)",
          nullable: true,
          isPrimary: false,
          description: "Total service amount",
        },
        {
          name: "payment_status",
          type: "VARCHAR(20)",
          nullable: false,
          isPrimary: false,
          description: "pending, paid, failed",
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          nullable: false,
          isPrimary: false,
          description: "Request creation date",
        },
        { name: "updated_at", type: "TIMESTAMP", nullable: false, isPrimary: false, description: "Last update date" },
      ],
    },
    {
      name: "payments",
      schema: "public",
      description: "Payment transaction records",
      icon: CreditCard,
      rowCount: 0,
      columns: [
        { name: "id", type: "UUID", nullable: false, isPrimary: true, description: "Unique payment identifier" },
        { name: "request_id", type: "UUID", nullable: false, isPrimary: false, description: "Related service request" },
        {
          name: "customer_id",
          type: "UUID",
          nullable: false,
          isPrimary: false,
          description: "Customer making payment",
        },
        {
          name: "provider_id",
          type: "UUID",
          nullable: true,
          isPrimary: false,
          description: "Service provider receiving payment",
        },
        { name: "amount", type: "DECIMAL(10,2)", nullable: false, isPrimary: false, description: "Payment amount" },
        {
          name: "payment_type",
          type: "VARCHAR(20)",
          nullable: false,
          isPrimary: false,
          description: "visiting_charges or service_charges",
        },
        {
          name: "payment_method",
          type: "VARCHAR(20)",
          nullable: false,
          isPrimary: false,
          description: "Payment method (upi, card, etc.)",
        },
        {
          name: "transaction_id",
          type: "VARCHAR(255)",
          nullable: true,
          isPrimary: false,
          description: "External transaction ID",
        },
        {
          name: "status",
          type: "VARCHAR(20)",
          nullable: false,
          isPrimary: false,
          description: "pending, completed, failed",
        },
        {
          name: "created_at",
          type: "TIMESTAMP",
          nullable: false,
          isPrimary: false,
          description: "Payment creation date",
        },
      ],
    },
    {
      name: "reviews",
      schema: "public",
      description: "Customer reviews and ratings",
      icon: Star,
      rowCount: 0,
      columns: [
        { name: "id", type: "UUID", nullable: false, isPrimary: true, description: "Unique review identifier" },
        { name: "request_id", type: "UUID", nullable: false, isPrimary: false, description: "Related service request" },
        {
          name: "customer_id",
          type: "UUID",
          nullable: false,
          isPrimary: false,
          description: "Customer who wrote review",
        },
        {
          name: "provider_id",
          type: "UUID",
          nullable: false,
          isPrimary: false,
          description: "Service provider being reviewed",
        },
        { name: "rating", type: "INTEGER", nullable: false, isPrimary: false, description: "Rating from 1 to 5 stars" },
        { name: "comment", type: "TEXT", nullable: true, isPrimary: false, description: "Review comment" },
        {
          name: "created_at",
          type: "TIMESTAMP",
          nullable: false,
          isPrimary: false,
          description: "Review creation date",
        },
      ],
    },
    {
      name: "admin_settings",
      schema: "public",
      description: "Application configuration settings",
      icon: Settings,
      rowCount: 0,
      columns: [
        { name: "id", type: "UUID", nullable: false, isPrimary: true, description: "Unique setting identifier" },
        {
          name: "setting_key",
          type: "VARCHAR(100)",
          nullable: false,
          isPrimary: false,
          description: "Setting key name",
        },
        { name: "setting_value", type: "TEXT", nullable: false, isPrimary: false, description: "Setting value" },
        { name: "description", type: "TEXT", nullable: true, isPrimary: false, description: "Setting description" },
        {
          name: "created_at",
          type: "TIMESTAMP",
          nullable: false,
          isPrimary: false,
          description: "Setting creation date",
        },
        { name: "updated_at", type: "TIMESTAMP", nullable: false, isPrimary: false, description: "Last update date" },
      ],
    },
    {
      name: "admin_activity_log",
      schema: "public",
      description: "Admin actions and activity log",
      icon: Activity,
      rowCount: 0,
      columns: [
        { name: "id", type: "UUID", nullable: false, isPrimary: true, description: "Unique log identifier" },
        {
          name: "admin_id",
          type: "UUID",
          nullable: false,
          isPrimary: false,
          description: "Admin who performed action",
        },
        {
          name: "action_type",
          type: "VARCHAR(50)",
          nullable: false,
          isPrimary: false,
          description: "Type of action performed",
        },
        {
          name: "action_details",
          type: "JSONB",
          nullable: true,
          isPrimary: false,
          description: "Detailed action information",
        },
        { name: "ip_address", type: "INET", nullable: true, isPrimary: false, description: "IP address of admin" },
        { name: "created_at", type: "TIMESTAMP", nullable: false, isPrimary: false, description: "Action timestamp" },
      ],
    },
  ]

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable)
    }
  }, [selectedTable])

  const fetchTableData = async (tableName: string) => {
    setLoading(true)
    try {
      // Fetch data from the selected table
      const { data, error } = await supabase.from(tableName).select("*").limit(50) // Limit to first 50 rows for performance

      if (error) {
        console.error(`Error fetching ${tableName}:`, error)
        // Generate mock data for demo
        setTableData(generateMockData(tableName, 10))
      } else {
        setTableData(data || [])
      }
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error)
      // Generate mock data for demo
      setTableData(generateMockData(tableName, 10))
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = (tableName: string, count: number) => {
    const mockData = []

    for (let i = 1; i <= count; i++) {
      switch (tableName) {
        case "users":
          mockData.push({
            id: `user-${i}`,
            email: `user${i}@demo.com`,
            full_name: `Demo User ${i}`,
            phone: `123456789${i}`,
            address: `${i} Demo Street, Demo City`,
            user_type: i <= 3 ? "customer" : i <= 6 ? "provider" : "admin",
            service_type: i > 3 && i <= 6 ? (i % 2 === 0 ? "electrician" : "plumber") : null,
            experience: i > 3 && i <= 6 ? Math.floor(Math.random() * 10) + 1 : null,
            description:
              i > 3 && i <= 6 ? `Professional ${i % 2 === 0 ? "electrician" : "plumber"} with experience` : null,
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          break

        case "service_requests":
          mockData.push({
            id: `req-${i}`,
            customer_id: `user-${Math.floor(Math.random() * 3) + 1}`,
            provider_id: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 3) + 4}` : null,
            service_type: Math.random() > 0.5 ? "electrician" : "plumber",
            problem_description: `Sample problem description ${i}`,
            problem_image_url: Math.random() > 0.5 ? `/placeholder.svg?height=200&width=300` : null,
            preferred_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            preferred_time: `${Math.floor(Math.random() * 12) + 9}:00`,
            customer_address: `${i} Service Address, Demo City`,
            status: ["pending", "accepted", "payment_pending", "in_progress", "completed"][
              Math.floor(Math.random() * 5)
            ],
            visiting_charges: 500.0,
            total_amount: Math.random() > 0.5 ? (Math.random() * 2000 + 500).toFixed(2) : null,
            payment_status: ["pending", "paid", "failed"][Math.floor(Math.random() * 3)],
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          break

        case "payments":
          mockData.push({
            id: `pay-${i}`,
            request_id: `req-${i}`,
            customer_id: `user-${Math.floor(Math.random() * 3) + 1}`,
            provider_id: `user-${Math.floor(Math.random() * 3) + 4}`,
            amount: (Math.random() * 1000 + 500).toFixed(2),
            payment_type: Math.random() > 0.5 ? "visiting_charges" : "service_charges",
            payment_method: "upi",
            transaction_id: `TXN${Date.now()}${i}`,
            status: ["pending", "completed", "failed"][Math.floor(Math.random() * 3)],
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          })
          break

        case "reviews":
          mockData.push({
            id: `review-${i}`,
            request_id: `req-${i}`,
            customer_id: `user-${Math.floor(Math.random() * 3) + 1}`,
            provider_id: `user-${Math.floor(Math.random() * 3) + 4}`,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: `Great service! Review comment ${i}`,
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          })
          break

        case "admin_settings":
          mockData.push({
            id: `setting-${i}`,
            setting_key: `app_setting_${i}`,
            setting_value: `value_${i}`,
            description: `Application setting ${i} description`,
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          break

        case "admin_activity_log":
          mockData.push({
            id: `log-${i}`,
            admin_id: "admin-demo",
            action_type: ["login", "update_user", "delete_request", "view_reports"][Math.floor(Math.random() * 4)],
            action_details: { target: "users", action: "view", timestamp: new Date().toISOString() },
            ip_address: "192.168.1.1",
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          })
          break

        default:
          mockData.push({
            id: `item-${i}`,
            name: `Sample Item ${i}`,
            created_at: new Date().toISOString(),
          })
      }
    }

    return mockData
  }

  const currentTable = tables.find((t) => t.name === selectedTable)
  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Database className="h-10 w-10 text-blue-400" />
            Database Access Center
          </h1>
          <p className="text-gray-300 text-lg">Complete database exploration and management</p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {tables.map((table) => {
            const IconComponent = table.icon
            return (
              <Card
                key={table.name}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedTable === table.name
                    ? "bg-blue-600 border-blue-400 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setSelectedTable(table.name)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">{table.name}</h3>
                  <p className="text-xs opacity-75 mt-1">{table.rowCount} rows</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table List Sidebar */}
          <Card className="bg-gray-800 border-gray-700 text-white lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5 text-blue-400" />
                Database Tables
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tables..."
                  className="pl-8 bg-gray-700 border-gray-600 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {tables.map((table) => {
                const IconComponent = table.icon
                return (
                  <Button
                    key={table.name}
                    variant={selectedTable === table.name ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedTable === table.name ? "bg-blue-600 hover:bg-blue-700" : "text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedTable(table.name)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{table.name}</div>
                      <div className="text-xs opacity-75">{table.description}</div>
                    </div>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {currentTable && (
              <>
                {/* Table Info Header */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <currentTable.icon className="h-6 w-6 text-blue-400" />
                        <div>
                          <CardTitle className="text-xl">{currentTable.name}</CardTitle>
                          <CardDescription className="text-gray-300">{currentTable.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => fetchTableData(selectedTable)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Table Content Tabs */}
                <Tabs defaultValue="data" className="space-y-4">
                  <TabsList className="bg-gray-800 border-gray-700">
                    <TabsTrigger value="data" className="data-[state=active]:bg-blue-600">
                      <Eye className="h-4 w-4 mr-2" />
                      Data ({filteredData.length} rows)
                    </TabsTrigger>
                    <TabsTrigger value="schema" className="data-[state=active]:bg-blue-600">
                      <Database className="h-4 w-4 mr-2" />
                      Schema ({currentTable.columns.length} columns)
                    </TabsTrigger>
                  </TabsList>

                  {/* Data Tab */}
                  <TabsContent value="data">
                    <Card className="bg-gray-800 border-gray-700 text-white">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Table Data</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-blue-600">
                              {filteredData.length} records
                            </Badge>
                            {loading && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        ) : filteredData.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No data found in this table</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  {Object.keys(filteredData[0]).map((column) => (
                                    <th key={column} className="text-left p-2 font-medium text-gray-300">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {filteredData.slice(0, 20).map((row, index) => (
                                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                    {Object.entries(row).map(([column, value]) => (
                                      <td key={column} className="p-2 text-gray-300">
                                        <div className="max-w-xs truncate">
                                          {value === null ? (
                                            <span className="text-gray-500 italic">null</span>
                                          ) : typeof value === "object" ? (
                                            <span className="text-blue-400">JSON</span>
                                          ) : (
                                            String(value)
                                          )}
                                        </div>
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Schema Tab */}
                  <TabsContent value="schema">
                    <Card className="bg-gray-800 border-gray-700 text-white">
                      <CardHeader>
                        <CardTitle>Table Schema</CardTitle>
                        <CardDescription className="text-gray-300">Column definitions and constraints</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentTable.columns.map((column) => (
                            <div key={column.name} className="border border-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-white">{column.name}</h4>
                                  {column.isPrimary && (
                                    <Badge variant="default" className="bg-yellow-600 text-xs">
                                      PRIMARY KEY
                                    </Badge>
                                  )}
                                  {!column.nullable && (
                                    <Badge variant="secondary" className="bg-red-600 text-xs">
                                      NOT NULL
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant="outline" className="border-gray-600 text-gray-300">
                                  {column.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">{column.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>

        {/* Access Instructions */}
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Direct Database Access Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-200">🔗 Supabase Dashboard</h4>
                <div className="space-y-2 text-sm">
                  <p>1. Go to your Supabase project dashboard</p>
                  <p>2. Click on "Table Editor" in the sidebar</p>
                  <p>3. Select any table to view/edit data</p>
                  <p>4. Use filters and search to find specific records</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-200">💻 SQL Editor</h4>
                <div className="space-y-2 text-sm">
                  <p>1. Go to "SQL Editor" in Supabase dashboard</p>
                  <p>2. Write custom SQL queries</p>
                  <p>
                    3. Example: <code className="bg-gray-800 px-2 py-1 rounded">SELECT * FROM users;</code>
                  </p>
                  <p>4. Run queries and export results</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
