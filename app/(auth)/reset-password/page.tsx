"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Scale, Eye, EyeOff, CheckCircle2, Loader2, ArrowRight } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [error, setError] = useState("")

  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[a-z]/.test(password), text: "One lowercase letter" },
    { met: /[0-9]/.test(password), text: "One number" },
  ]

  const allRequirementsMet = passwordRequirements.every((req) => req.met)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!allRequirementsMet) {
      setError("Please meet all password requirements")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsReset(true)
    setIsLoading(false)
  }

  if (isReset) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="mt-4 text-2xl">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been updated. You can now log in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/login")}
          >
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">SheriaBot</span>
        </Link>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">Password Requirements</p>
            <div className="grid grid-cols-2 gap-2">
              {passwordRequirements.map((req) => (
                <div key={req.text} className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${req.met ? "bg-secondary" : "bg-muted-foreground/30"}`} />
                  <span className={`text-xs ${req.met ? "text-secondary" : "text-muted-foreground"}`}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !allRequirementsMet}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
