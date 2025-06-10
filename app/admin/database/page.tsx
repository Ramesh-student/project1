"use client"

import { useState } from "react"
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
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function AdminDatabasePage() {
  const [selectedTable, setSelectedTable] = useState("users")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for demonstration
  const tables = [
    { name: "users", icon: Users, description: "User profiles", count: 245 },
    { name: "service_requests", icon: FileText, description: "Service bookings", count: 128 },
    { name: "payments", icon: CreditCard, description: "Payment records", count: 96 },
    { name: "reviews", icon: Star, description: "Customer reviews", count: 57 },
    { name: "admin_settings", icon: Settings, description: "System settings", count: 12 },
    { name: "admin_activity_log", icon: Activity, description: "Admin actions", count: 342 },
  ]

  // Generate mock data for the selected table
  const generateMockData = (tableName, count = 10) => {
    const data = []
    for (let i = 1; i <= count; i++) {
      switch (tableName) {
        case "users":
          data.push({
            id: `user-${i}`,
            email: `user${i}@example.com`,
            full_name: `User ${i}`,
            user_type: i % 3 === 0 ? "provider" : i % 5 === 0 ? "admin" : "customer",
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          })
          break
        case "service_requests":
          data.push({
            id: `req-${i}`,
            customer_id: `user-${i + 10}`,
            service_type: i % 2 === 0 ? "electrical" : "plumbing",
            status: ["pending", "accepted", "in_progress", "completed", "cancelled"][i % 5],
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          })
          break
        case "payments":
          data.push({
            id: `pay-${i}`,
            request_id: `req-${i}`,
            amount: (Math.random() * 2000 + 500).toFixed(2),
            status: ["pending", "completed", "failed"][i % 3],
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          })
          break
        default:
          data.push({
            id: `item-${i}`,
            name: `Sample ${tableName} ${i}`,
            created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          })
      }
    }
    return data
  }

  const tableData = generateMockData(selectedTable)
  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Access and manage application data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/database-access">
            <Button className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Advanced Explorer
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table List Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-5 w-5" />
              Database Tables
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tables..."
                className="pl-8"
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
                  className="w-full justify-start"
                  onClick={() => setSelectedTable(table.name)}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{table.name}</div>
                    <div className="text-xs text-gray-500">
                      {table.description} • {table.count} records
                    </div>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Table Info Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const TableIcon = tables.find((t) => t.name === selectedTable)?.icon || Database
                    return <TableIcon className="h-6 w-6" />
                  })()}
                  <div>
                    <CardTitle className="text-xl">{selectedTable}</CardTitle>
                    <CardDescription>
                      {tables.find((t) => t.name === selectedTable)?.description || "Table data"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTable(selectedTable)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Table Content Tabs */}
          <Tabs defaultValue="data" className="space-y-4">
            <TabsList>
              <TabsTrigger value="data">
                <Eye className="h-4 w-4 mr-2" />
                Data ({filteredData.length} rows)
              </TabsTrigger>
              <TabsTrigger value="query">
                <Database className="h-4 w-4 mr-2" />
                SQL Query
              </TabsTrigger>
            </TabsList>

            {/* Data Tab */}
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Table Data</CardTitle>
                    <Badge variant="secondary">{filteredData.length} records</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {Object.keys(filteredData[0] || {}).map((column) => (
                            <th key={column} className="text-left p-2 font-medium">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((row, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            {Object.entries(row).map(([column, value]) => (
                              <td key={column} className="p-2">
                                <div className="max-w-xs truncate">
                                  {value === null ? (
                                    <span className="text-gray-500 italic">null</span>
                                  ) : typeof value === "object" ? (
                                    <span className="text-blue-500">JSON</span>
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Query Tab */}
            <TabsContent value="query">
              <Card>
                <CardHeader>
                  <CardTitle>SQL Query Editor</CardTitle>
                  <CardDescription>Run custom SQL queries on the database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                      <pre className="text-sm">
                        <code>{`SELECT * FROM ${selectedTable} LIMIT 10;`}</code>
                      </pre>
                    </div>
                    <div className="flex justify-end">
                      <Button>Run Query</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Access Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Database Access Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🔗 Advanced Explorer</h4>
                  <div className="space-y-2 text-sm">
                    <p>For more advanced database exploration:</p>
                    <Link href="/database-access">
                      <Button variant="outline" className="w-full">
                        Open Full Database Explorer
                      </Button>
                    </Link>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">💻 SQL Editor</h4>
                  <div className="space-y-2 text-sm">
                    <p>For complex queries and database operations:</p>
                    <Link href="/admin/sql-editor">
                      <Button variant="outline" className="w-full">
                        Open SQL Editor
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
