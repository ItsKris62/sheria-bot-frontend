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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye, EyeOff, Building2, Rocket, Scale } from "lucide-react"

const organizationTypes = [
  { id: "startup", label: "Fintech Startup", description: "Digital lender, payment provider, etc.", icon: Rocket },
  { id: "enterprise", label: "Financial Institution", description: "Bank, SACCO, microfinance", icon: Building2 },
  { id: "regulator", label: "Regulator", description: "CBK, CMA, or government agency", icon: Scale },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    organizationType: "",
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Redirect based on organization type
    if (formData.organizationType === "regulator") {
      router.push("/regulator")
    } else {
      router.push("/startup")
    }
    setIsLoading(false)
  }

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
                      onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
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
                  Minimum 8 characters with at least one number
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
                  disabled={isLoading || !formData.agreeTerms}
                >
                  {isLoading ? (
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
