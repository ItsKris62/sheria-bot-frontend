"use client"

import React, { Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Scale, Mail, CheckCircle2, Clock, ArrowRight } from "lucide-react"
import { trpc, getErrorMessage } from "@/lib/trpc"
import { LoadingScreen } from "@/components/loading-screen"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const verifyMutation = trpc.auth.verifyEmail.useMutation()

  // Auto-verify when token is present in URL
  useEffect(() => {
    if (token && !verifyMutation.isSuccess && !verifyMutation.isError && !verifyMutation.isPending) {
      verifyMutation.mutate({ token })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // ── With token: verification flow ──

  if (token) {
    if (verifyMutation.isPending || (!verifyMutation.isSuccess && !verifyMutation.isError)) {
      return <LoadingScreen fullScreen={false} size="md" message="Verifying your email..." />
    }

    if (verifyMutation.isError) {
      return (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verification Failed</CardTitle>
            <CardDescription>
              {getErrorMessage(verifyMutation.error)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                The verification link may have expired or already been used. Please request a new one by logging in and visiting your account settings.
              </AlertDescription>
            </Alert>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (verifyMutation.isSuccess) {
      const requiresApproval = verifyMutation.data.requiresApproval

      return (
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${requiresApproval ? "bg-yellow-500/10" : "bg-secondary/10"}`}>
              {requiresApproval ? (
                <Clock className="h-8 w-8 text-yellow-500" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-secondary" />
              )}
            </div>
            <CardTitle className="mt-4 text-2xl">
              {requiresApproval ? "Email Verified — Pending Approval" : "Email Verified!"}
            </CardTitle>
            <CardDescription>
              {requiresApproval
                ? "Your email has been verified. Your regulator account is pending admin approval. You will receive an email once approved."
                : "Your email has been successfully verified. You can now access all features."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push(requiresApproval ? "/login" : "/startup")}
            >
              {requiresApproval ? "Back to Login" : "Go to Dashboard"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )
    }
  }

  // ── No token: "check your email" state ──

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
            Didn&apos;t receive the email? Check your spam folder. If you still need help,{" "}
            <Link href="/support" className="text-primary hover:underline">contact support</Link>.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button variant="ghost" asChild className="w-full">
          <Link href="/login">Back to Login</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingScreen fullScreen={false} size="md" />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
