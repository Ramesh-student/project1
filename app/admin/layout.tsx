"use client"

import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
