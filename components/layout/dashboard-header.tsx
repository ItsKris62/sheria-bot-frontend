"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Building2,
  ChevronDown,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useAuth } from "@/hooks/use-auth"
import { useUnreadCount, useNotifications, useNotificationActions } from "@/hooks/use-notifications"

/** Format a date as a relative time string (e.g. "5 minutes ago") */
function relativeTime(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

/** Map backend notification types to UI icon variants */
function notificationVariant(type: string): "alert" | "success" | "info" {
  if (type === "COMPLIANCE_ALERT" || type === "DEADLINE_ALERT") return "alert"
  if (type === "POLICY_READY" || type === "DOCUMENT_READY") return "success"
  return "info"
}

interface DashboardHeaderProps {
  userType: "regulator" | "startup"
}

export function DashboardHeader({ userType }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const authUser = useAuthStore((s) => s.user)
  const { logout } = useAuth()

  const user = {
    name: authUser?.name || (userType === "regulator" ? "Regulator" : "User"),
    email: authUser?.email || "",
    organization: userType === "regulator" ? "Regulator" : "Startup",
    role: authUser?.role || userType.toUpperCase(),
  }

  // Real notification data from the backend
  const { data: unreadData } = useUnreadCount()
  const { data: notifData, isLoading: isLoadingNotifs } = useNotifications({ limit: 10 })
  const { markAllAsRead, isMarkingAllAsRead } = useNotificationActions()

  const unreadCount = unreadData?.count ?? 0
  const notificationList = notifData?.notifications ?? []

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      {/* Left side - Search */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="hidden w-64 justify-start gap-2 text-muted-foreground lg:flex bg-transparent"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto hidden rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground lg:inline-block">
            /
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-96">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Notifications
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Badge variant="secondary">{unreadCount} new</Badge>
                  )}
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => markAllAsRead()}
                      disabled={isMarkingAllAsRead}
                    >
                      {isMarkingAllAsRead ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Mark all read
                    </Button>
                  )}
                </div>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="mt-6 h-[calc(100vh-8rem)]">
              <div className="flex flex-col gap-2">
                {isLoadingNotifs ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading…
                  </div>
                ) : notificationList.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                ) : (
                  notificationList.map((notification: any) => {
                    const variant = notificationVariant(notification.type ?? "")
                    const isUnread = !notification.readAt
                    return (
                      <div
                        key={notification.id}
                        className={`flex gap-3 rounded-lg p-3 transition-colors ${
                          isUnread ? "bg-muted/50" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            variant === "alert"
                              ? "bg-destructive/10 text-destructive"
                              : variant === "success"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {variant === "alert" ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : variant === "success" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {relativeTime(notification.createdAt)}
                          </p>
                        </div>
                        {isUnread && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Help */}
        <Button variant="ghost" size="icon" asChild>
          <Link href="/support">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Link>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.organization}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/organization" className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" />
                Organization
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
