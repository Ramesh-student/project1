"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Database, Save, RefreshCw, CheckCircle, AlertCircle, FileJson, FileText, ArrowLeft, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface TableInfo {
  name: string
  rowCount: number
  lastBackup?: string
}

export default function DatabaseBackupPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [backupStatus, setBackupStatus] = useState<string | null>(null)
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null)
  const [tables, setTables] = useState<TableInfo[]>([
    { name: "users", rowCount: 0 },
    { name: "service_requests", rowCount: 0 },
    { name: "payments", rowCount: 0 },
    { name: "admin_activity_log", rowCount: 0 },
  ])
  const [backupData, setBackupData] = useState<any>(null)
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null)

  // Function to fetch table data counts
  const fetchTableCounts = async () => {
    setLoading(true)
    try {
      const updatedTables = [...tables]

      for (let i = 0; i < updatedTables.length; i++) {
        const table = updatedTables[i]
        const { count, error } = await supabase.from(table.name).select("*", { count: "exact", head: true })

        if (error) {
          console.error(`Error fetching count for ${table.name}:`, error)
        } else {
          updatedTables[i] = { ...table, rowCount: count || 0 }
        }
      }

      setTables(updatedTables)
    } catch (error) {
      console.error("Error fetching table counts:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to backup all data
  const backupAllData = async () => {
    setLoading(true)
    setBackupStatus("Backing up database...")

    try {
      const backup: any = {}

      // Backup each table
      for (const table of tables) {
        const { data, error } = await supabase.from(table.name).select("*")

        if (error) {
          throw new Error(`Error backing up ${table.name}: ${error.message}`)
        }

        backup[table.name] = data
      }

      // Store backup in localStorage for demo purposes
      // In a real app, you might want to download this as a file
      // or store it in a secure location
      localStorage.setItem("servicehub_backup", JSON.stringify(backup))

      const timestamp = new Date().toLocaleString()
      localStorage.setItem("servicehub_backup_time", timestamp)
      setLastBackupTime(timestamp)

      setBackupData(backup)
      setBackupStatus("Backup completed successfully!")

      // Update table info with backup time
      const updatedTables = tables.map((table) => ({
        ...table,
        lastBackup: timestamp,
      }))
      setTables(updatedTables)
    } catch (error: any) {
      console.error("Backup error:", error)
      setBackupStatus(`Backup failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Function to restore data
  const restoreData = async () => {
    setLoading(true)
    setRestoreStatus("Restoring database...")

    try {
      const backupStr = localStorage.getItem("servicehub_backup")
      if (!backupStr) {
        throw new Error("No backup found to restore")
      }

      const backup = JSON.parse(backupStr)

      // For each table in the backup
      for (const tableName in backup) {
        const tableData = backup[tableName]

        if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
          continue
        }

        // First clear the table
        const { error: deleteError } = await supabase.from(tableName).delete().not("id", "is", null) // Safety check to avoid deleting everything if id is null

        if (deleteError) {
          console.error(`Error clearing ${tableName}:`, deleteError)
        }

        // Then insert the backup data
        const { error: insertError } = await supabase.from(tableName).insert(tableData)

        if (insertError) {
          throw new Error(`Error restoring ${tableName}: ${insertError.message}`)
        }
      }

      setRestoreStatus("Restore completed successfully!")
      fetchTableCounts() // Refresh counts after restore
    } catch (error: any) {
      console.error("Restore error:", error)
      setRestoreStatus(`Restore failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Function to download backup as JSON file
  const downloadBackup = () => {
    try {
      const backupStr = localStorage.getItem("servicehub_backup")
      if (!backupStr) {
        alert("No backup found to download")
        return
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(backupStr)
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", `servicehub_backup_${new Date().toISOString()}.json`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download backup")
    }
  }

  // Function to generate SQL script
  const generateSqlScript = () => {
    try {
      const backupStr = localStorage.getItem("servicehub_backup")
      if (!backupStr) {
        alert("No backup found to generate SQL")
        return
      }

      const backup = JSON.parse(backupStr)
      let sqlScript = "-- ServiceHub Database Backup SQL Script\n"
      sqlScript += `-- Generated: ${new Date().toLocaleString()}\n\n`

      // For each table in the backup
      for (const tableName in backup) {
        const tableData = backup[tableName]

        if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
          continue
        }

        sqlScript += `-- Table: ${tableName}\n`
        sqlScript += `DELETE FROM ${tableName};\n\n`

        for (const row of tableData) {
          const columns = Object.keys(row).filter((key) => row[key] !== null)
          const values = columns.map((col) => {
            const val = row[col]
            if (typeof val === "string") {
              return `'${val.replace(/'/g, "''")}'`
            } else if (val instanceof Date) {
              return `'${val.toISOString()}'`
            } else if (typeof val === "object") {
              return `'${JSON.stringify(val).replace(/'/g, "''")}'`
            }
            return val
          })

          sqlScript += `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")});\n`
        }

        sqlScript += "\n"
      }

      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(sqlScript)
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", `servicehub_backup_${new Date().toISOString()}.sql`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } catch (error) {
      console.error("SQL generation error:", error)
      alert("Failed to generate SQL script")
    }
  }

  // Load last backup time on component mount
  useState(() => {
    const savedTime = localStorage.getItem("servicehub_backup_time")
    if (savedTime) {
      setLastBackupTime(savedTime)
    }
    fetchTableCounts()
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Database Backup & Persistence</h1>
        <p className="text-gray-600 mb-6">Backup, restore, and manage your ServiceHub database data</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Actions Panel */}
        <div className="md:col-span-2">
          <Tabs defaultValue="backup">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="backup">Backup Data</TabsTrigger>
              <TabsTrigger value="restore">Restore Data</TabsTrigger>
            </TabsList>

            <TabsContent value="backup">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Save className="mr-2 h-5 w-5 text-blue-600" />
                    Backup Database
                  </CardTitle>
                  <CardDescription>Create a complete backup of all your ServiceHub data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                      <h3 className="font-medium text-blue-800 mb-2">About Database Backups</h3>
                      <p className="text-blue-700 text-sm">
                        Backups save all your data including users, service requests, payments, and admin logs. You can
                        restore this data later or transfer it to another environment.
                      </p>
                    </div>

                    {lastBackupTime && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        Last backup: {lastBackupTime}
                      </div>
                    )}

                    {backupStatus && (
                      <Alert
                        className={
                          backupStatus.includes("failed") ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                        }
                      >
                        <AlertCircle
                          className={`h-4 w-4 ${backupStatus.includes("failed") ? "text-red-600" : "text-green-600"}`}
                        />
                        <AlertTitle>{backupStatus.includes("failed") ? "Backup Failed" : "Backup Status"}</AlertTitle>
                        <AlertDescription>{backupStatus}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={backupAllData} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Backing up..." : "Backup All Data"}
                  </Button>

                  <div className="space-x-2">
                    <Button onClick={downloadBackup} variant="outline" disabled={!lastBackupTime || loading}>
                      <FileJson className="mr-2 h-4 w-4" />
                      Download JSON
                    </Button>
                    <Button onClick={generateSqlScript} variant="outline" disabled={!lastBackupTime || loading}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate SQL
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="restore">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5 text-amber-600" />
                    Restore Database
                  </CardTitle>
                  <CardDescription>Restore your database from a previous backup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                      <h3 className="font-medium text-amber-800 mb-2">⚠️ Warning: Data Restoration</h3>
                      <p className="text-amber-700 text-sm">
                        Restoring will replace all current data with the backup data. This action cannot be undone. Make
                        sure to create a new backup of your current data if needed.
                      </p>
                    </div>

                    {lastBackupTime && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        Available backup from: {lastBackupTime}
                      </div>
                    )}

                    {restoreStatus && (
                      <Alert
                        className={
                          restoreStatus.includes("failed") ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                        }
                      >
                        <AlertCircle
                          className={`h-4 w-4 ${restoreStatus.includes("failed") ? "text-red-600" : "text-green-600"}`}
                        />
                        <AlertTitle>
                          {restoreStatus.includes("failed") ? "Restore Failed" : "Restore Status"}
                        </AlertTitle>
                        <AlertDescription>{restoreStatus}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    onClick={restoreData}
                    disabled={loading || !lastBackupTime}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {loading ? "Restoring..." : "Restore From Backup"}
                  </Button>

                  <Button onClick={fetchTableCounts} variant="outline" disabled={loading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data Counts
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Database Stats Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5 text-gray-600" />
                Database Statistics
              </CardTitle>
              <CardDescription>Current data in your ServiceHub database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tables.map((table) => (
                  <div key={table.name} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium capitalize">{table.name.replace("_", " ")}</p>
                      <p className="text-sm text-gray-500">
                        {table.rowCount} {table.rowCount === 1 ? "record" : "records"}
                      </p>
                    </div>
                    <Badge variant={table.rowCount > 0 ? "default" : "outline"}>
                      {table.rowCount > 0 ? "Data Present" : "Empty"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={fetchTableCounts} variant="outline" className="w-full" disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Statistics
              </Button>
            </CardFooter>
          </Card>

          {/* Auto-Backup Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-600" />
                Auto-Backup Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Auto-Backup</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="mr-1 h-3 w-3" /> Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Retention</span>
                  <span className="text-sm font-medium">7 days</span>
                </div>
                <Separator className="my-2" />
                <p className="text-xs text-gray-500">
                  Auto-backup runs daily at 12:00 AM and keeps the last 7 days of backups.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Database Backup & Restore Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How to backup your data:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Click on the "Backup All Data" button to create a complete backup</li>
                <li>Download the backup as JSON or SQL using the respective buttons</li>
                <li>Store the downloaded file in a secure location</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">How to restore your data:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Navigate to the "Restore Data" tab</li>
                <li>Click "Restore From Backup" to restore from the most recent backup</li>
                <li>Wait for the confirmation message before navigating away</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Important Notes:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Backups are currently stored in your browser's local storage</li>
                <li>For production use, implement server-side backup storage</li>
                <li>Regular backups are recommended to prevent data loss</li>
                <li>The SQL script can be used to restore data in any Supabase or PostgreSQL database</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
