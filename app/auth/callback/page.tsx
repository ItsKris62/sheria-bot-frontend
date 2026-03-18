"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  ArrowRight,
  FileText,
  BarChart3,
  BookOpen,
  Mail,
  Loader2,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"
import { trpc } from "@/lib/trpc"

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = "loading" | "success" | "pending_approval" | "error"

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ stage }: { stage: Stage }) {
  const steps = ["Register", "Verify Email", "Access Platform"]
  const activeStep =
    stage === "loading" ? 1 : stage === "error" ? 1 : 2

  return (
    <div className="flex items-center gap-0 w-full max-w-xs mx-auto">
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`
                h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                ${i < activeStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : i === activeStep
                  ? stage === "error"
                    ? "border-destructive text-destructive bg-destructive/10"
                    : "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground bg-muted/30"
                }
              `}
            >
              {i < activeStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium tracking-wide text-center leading-tight ${
                i <= activeStep ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-[2px] flex-1 mb-4 rounded-full transition-colors ${
                i < activeStep ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function LoadingState() {
  const steps = [
    "Validating your verification link",
    "Confirming with Our Servers",
    "Activating your account",
  ]
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s))
    }, 1400)
    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="text-center space-y-8">
      {/* Spinner */}
      <div className="relative mx-auto h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-r-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-foreground">Verifying your email</h2>
        <p className="text-sm text-muted-foreground">
          Please wait — this takes just a moment.
        </p>
      </div>

      {/* Step progress */}
      <div className="space-y-3 text-left rounded-xl border border-border/50 bg-muted/20 p-5">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="shrink-0">
              {i < currentStep ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : i === currentStep ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-border bg-muted/50" />
              )}
            </div>
            <span
              className={`text-sm transition-colors ${
                i <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SuccessState({ role }: { role: string }) {
  const router = useRouter()

  const features =
    role === "REGULATOR"
      ? [
          { icon: FileText, text: "Review fintech compliance submissions" },
          { icon: BarChart3, text: "Monitor sector-wide compliance metrics" },
          { icon: BookOpen, text: "Access regulatory document library" },
        ]
      : [
          { icon: FileText, text: "Generate AI-powered compliance checklists" },
          { icon: BarChart3, text: "Track your compliance score in real time" },
          { icon: BookOpen, text: "Query 40+ Kenya regulatory documents" },
        ]

  return (
    <div className="space-y-8">
      {/* Icon */}
      <div className="text-center space-y-4">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping [animation-duration:2s]" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border-2 border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Email Verified!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Your account is active and secured. Welcome to SheriaBot — Kenya&apos;s leading
            regulatory intelligence platform.
          </p>
        </div>
      </div>

      {/* What you can do */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          What you can do now
        </p>
        <div className="space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold"
        onClick={() => router.push("/startup")}
      >
        Go to Dashboard
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Already have your password?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in instead
        </Link>
      </p>
    </div>
  )
}

function PendingApprovalState() {
  const timeline = [
    {
      step: "1",
      title: "Email verified",
      desc: "Your email address has been confirmed.",
      done: true,
    },
    {
      step: "2",
      title: "Admin review",
      desc: "Our team verifies your regulatory credentials and government domain.",
      done: false,
    },
    {
      step: "3",
      title: "Account activation",
      desc: "You receive an approval email and can log in.",
      done: false,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Icon */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 border-2 border-amber-500/30">
          <Clock className="h-10 w-10 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Email Verified</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Your regulator account requires manual verification of your government
            credentials before access is granted.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Approval process
        </p>
        {timeline.map((item, i) => (
          <div key={item.step} className="flex gap-4">
            {/* Left column: dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  item.done
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-500"
                    : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : item.step}
              </div>
              {i < timeline.length - 1 && (
                <div
                  className={`w-[2px] flex-1 my-1 rounded-full min-h-[28px] ${
                    item.done ? "bg-emerald-500/40" : "bg-border"
                  }`}
                />
              )}
            </div>
            {/* Right column: text */}
            <div className="pb-6">
              <p className={`text-sm font-semibold ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <Mail className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Check your inbox</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            You will receive an email once your account is approved. Typical review
            time is <span className="text-foreground font-medium">1–2 business days</span>.
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 font-semibold"
        asChild
      >
        <Link href="/login">
          Back to Login
        </Link>
      </Button>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      {/* Icon */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border-2 border-destructive/30">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Verification Failed</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>
      </div>

      {/* Error detail */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
        <p className="text-sm font-medium text-foreground">Common reasons this happens:</p>
        <ul className="space-y-1.5 text-xs text-muted-foreground list-none">
          {[
            "The link expired (valid for 24 hours)",
            "The link was already used",
            "You clicked an old link after requesting a new one",
          ].map((reason) => (
            <li key={reason} className="flex items-start gap-2">
              <span className="text-destructive mt-0.5">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold"
          asChild
        >
          <Link href="/login">
            Request a New Link
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Need help?{" "}
          <a
            href="mailto:support@sheriabot.com"
            className="text-primary hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AuthCallbackPage() {
  const [stage, setStage] = useState<Stage>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [userRole, setUserRole] = useState<string>("STARTUP")

  const confirmMutation = trpc.auth.confirmEmailCallback.useMutation()
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    async function handleCallback() {
      try {
        // Supabase (detectSessionInUrl: true) auto-processes the URL hash and
        // sets the session before getSession() is called.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          setErrorMessage(
            "The verification link is invalid or has expired. Please request a new verification email."
          )
          setStage("error")
          return
        }

        // Get the Supabase user role from the session metadata to drive the UI
        const supabaseRole = (session.user?.user_metadata?.role as string) || "STARTUP"
        setUserRole(supabaseRole)

        const result = await confirmMutation.mutateAsync({
          accessToken: session.access_token,
        })

        if (result.requiresApproval) {
          setStage("pending_approval")
        } else {
          setStage("success")
        }
      } catch (err: any) {
        setErrorMessage(
          err?.message ||
            "Something went wrong while verifying your email. Please try again."
        )
        setStage("error")
      }
    }

    handleCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/hero-logo.png"
            alt="SheriaBot"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-foreground tracking-tight">SheriaBot</span>
            <span className="text-[9px] text-primary/80 font-semibold tracking-[0.15em] uppercase mt-0.5">
              Kenya Fintech
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Secured by Supabase Auth</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Step indicator */}
          <StepIndicator stage={stage} />

          {/* Card */}
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur p-8 shadow-xl shadow-black/10">
            {stage === "loading" && <LoadingState />}
            {stage === "success" && <SuccessState role={userRole} />}
            {stage === "pending_approval" && <PendingApprovalState />}
            {stage === "error" && <ErrorState message={errorMessage} />}
          </div>

          {/* Security trust badges */}
          {(stage === "success" || stage === "pending_approval") && (
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-bit TLS encryption</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>SOC 2 compliant infrastructure</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex h-12 shrink-0 items-center justify-center border-t border-border/30 px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SheriaBot. All rights reserved.{" "}
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  )
}
