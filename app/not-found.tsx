"use client"

import React, { useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import animationData from "@/public/animations/404-error.json"
import { Button } from "@/components/ui/button"

const MAX_LOOPS = 3

export default function NotFound() {
  const router = useRouter()
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const loopCountRef = useRef(0)

  const handleLoopComplete = () => {
    loopCountRef.current += 1
    if (loopCountRef.current >= MAX_LOOPS) {
      lottieRef.current?.pause()
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="w-full max-w-[400px]">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          onLoopComplete={handleLoopComplete}
        />
      </div>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-[#00875A] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#006644] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00875A] focus-visible:ring-offset-2"
        >
          Go Back
        </button>

        <Button variant="outline" asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
