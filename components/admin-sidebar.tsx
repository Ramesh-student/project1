"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Settings, Database, Shield, Save, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/admin/login"
  }

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Admin Accounts",
      icon: Shield,
      href: "/admin/admins",
      active: pathname === "/admin/admins",
    },
    {
      label: "Database Tools",
      icon: Database,
      href: "/admin/database",
      active: pathname === "/admin/database",
    },
    {
      label: "Database Backup",
      icon: Save,
      href: "/database-backup",
      active: pathname === "/database-backup",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-white",
                route.active ? "bg-blue-900/50 text-white" : "text-gray-400 hover:bg-blue-900/20",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:bg-red-900/20 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gray-900 border-gray-800 p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:block h-screen bg-gray-900 border-r border-gray-800", className)}>
        <div className="h-full w-64 flex flex-col">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
