"use client";

/**
 * Public Pilot Apply Page — Phase B4-2
 * Clean landing page for the SheriaBot Pilot Programme application.
 */

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, Shield, Zap, BookOpen, Scale } from "lucide-react";

const BENEFITS = [
  {
    icon: Zap,
    title: "Full Enterprise Access",
    description: "Unlimited compliance queries, document analysis, and regulatory alerts for 90 days.",
  },
  {
    icon: Shield,
    title: "No Payment Required",
    description: "Zero cost during the pilot. No credit card needed. Cancel anytime.",
  },
  {
    icon: BookOpen,
    title: "Dedicated Onboarding",
    description: "Personal onboarding session with our compliance team to get you up and running.",
  },
];

export default function PilotApplyPage() {
  const [firstName,    setFirstName]    = useState("");
  const [lastName,     setLastName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [companyName,  setCompanyName]  = useState("");
  const [jobTitle,     setJobTitle]     = useState("");
  const [phone,        setPhone]        = useState("");
  const [message,      setMessage]      = useState("");
  const [consent,      setConsent]      = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  const applyMutation = trpc.publicMarketing.applyForPilot.useMutation({
    onSuccess: () => setSubmitted(true),
    onError:   (err) => toast.error(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { toast.error("Please agree to receive communications to continue."); return; }
    applyMutation.mutate({
      firstName,
      lastName,
      email,
      companyName,
      jobTitle,
      phone:   phone   || undefined,
      message: message || undefined,
    });
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Application Received!</h1>
          <p className="text-muted-foreground">
            Thank you for applying. We&apos;ll review your application and be in touch within{" "}
            <strong>3 business days</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            In the meantime, feel free to{" "}
            <Link href="/" className="underline text-primary">explore SheriaBot</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-3">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SheriaBot</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Hero + Benefits */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Limited Spots Available
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                Apply for the SheriaBot Pilot Programme
              </h1>
              <p className="text-lg text-muted-foreground">
                Early access for Kenyan fintechs and regulated entities. Full Enterprise tier,
                90 days, no payment required.
              </p>
            </div>

            <div className="space-y-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Who qualifies?</strong> Fintechs, banks,
                SACCOs, insurance companies, and other regulated entities operating in Kenya
                under CBK, IRA, RBA, or CMA oversight.
              </p>
            </div>
          </div>

          {/* Right: Application Form */}
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Apply for the Pilot</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">First Name *</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name *</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Work Email *</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="jane@company.co.ke"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Company Name *</label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Acme Fintech Ltd"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Job Title *</label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Chief Compliance Officer"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone <span className="text-muted-foreground">(optional)</span></label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Tell us about your compliance challenges{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                  placeholder="e.g. We struggle to keep up with CBK circular updates…"
                />
                <p className="text-xs text-muted-foreground mt-1">{message.length}/1000</p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5"
                  required
                />
                <span className="text-sm text-muted-foreground">
                  I agree to receive communications from SheriaBot about the pilot programme and
                  related updates. I can unsubscribe at any time.
                </span>
              </label>

              <Button
                type="submit"
                className="w-full"
                disabled={applyMutation.isPending || !consent}
              >
                {applyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Apply for the Pilot
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By applying, you agree to our{" "}
                <Link href="/privacy" className="underline">Privacy Policy</Link>.
                We will never share your data with third parties.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
