"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff, Building2, Rocket, Scale, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const ROLE_MAP = {
  startup: "STARTUP",
  enterprise: "ENTERPRISE",
  regulator: "REGULATOR",
} as const

const organizationTypes = [
  { id: "startup" as const, label: "Fintech Startup", description: "Digital lender, payment provider, etc.", icon: Rocket },
  { id: "enterprise" as const, label: "Financial Institution", description: "Bank, SACCO, microfinance", icon: Building2 },
  { id: "regulator" as const, label: "Regulator", description: "CBK, CMA, or government agency", icon: Scale },
]

export default function RegisterPage() {
  const router = useRouter()
  const { register, isRegisterLoading, registerError } = useAuth()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    organizationType: "" as "" | "startup" | "enterprise" | "regulator",
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (step === 1) {
      setStep(2)
      return
    }

    if (!formData.organizationType) return

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        role: ROLE_MAP[formData.organizationType],
      })
      setSuccess(true)
    } catch {
      setError(registerError || "Registration failed. Please try again.")
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Check your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We&apos;ve sent a verification link to <strong className="text-foreground">{formData.email}</strong>.
            Please verify your email to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/login")}
          >
            Go to Sign In
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or contact support.
          </p>
        </CardContent>
      </Card>
    )
  }

  const displayError = error || registerError

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">Create your account</CardTitle>
        <CardDescription className="text-muted-foreground">
          {step === 1 ? "Choose your organization type" : "Complete your profile"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{displayError}</p>
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="space-y-3">
                {organizationTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all ${
                      formData.organizationType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="organizationType"
                      value={type.id}
                      checked={formData.organizationType === type.id}
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value as typeof formData.organizationType })}
                      className="sr-only"
                    />
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      formData.organizationType === type.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{type.label}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      formData.organizationType === type.id ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}>
                      {formData.organizationType === type.id && (
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!formData.organizationType}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-foreground">Organization Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Kamau"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Min 8 characters, with uppercase, lowercase, number, and special character
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isRegisterLoading || !formData.agreeTerms}
                >
                  {isRegisterLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
