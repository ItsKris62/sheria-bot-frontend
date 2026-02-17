"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Mail, CheckCircle2, Loader2, RefreshCw, ArrowRight } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Simulate verification check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerifying(false)
      // Simulate that email is not yet verified
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    setIsResending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsResending(false)
    setCountdown(60)
  }

  const handleSimulateVerify = async () => {
    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsVerified(true)
    setIsVerifying(false)
  }

  if (isVerifying) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying your email...</p>
        </CardContent>
      </Card>
    )
  }

  if (isVerified) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="mt-4 text-2xl">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now access all features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/startup")}
          >
            Go to Dashboard
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
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="mt-4 text-2xl">Verify Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to your email address. 
          Please check your inbox and click the link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or click below to resend.
          </p>
        </div>

        <Button 
          variant="outline" 
          className="w-full bg-transparent"
          onClick={handleResend}
          disabled={isResending || countdown > 0}
        >
          {isResending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : countdown > 0 ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend in {countdown}s
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resend Verification Email
            </>
          )}
        </Button>

        {/* Demo button - in production this would be triggered by email link */}
        <Button 
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={handleSimulateVerify}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Simulate Email Verification
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Need help?</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-center text-sm">
          <Link 
            href="/support" 
            className="text-primary hover:underline"
          >
            Contact Support
          </Link>
          <Link 
            href="/login" 
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
