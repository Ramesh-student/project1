"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription>We encountered an error while processing your request.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            If the problem persists, please contact support at{" "}
            <a href="mailto:rameshp333777@gmail.com" className="text-blue-600 hover:underline">
              rameshp333777@gmail.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
