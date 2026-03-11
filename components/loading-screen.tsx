"use client"

import React from "react"
import Lottie from "lottie-react"
import animationData from "@/public/animations/Loading.json"

export interface LoadingScreenProps {
  /** When true (default), fills the full viewport centered. When false, fills parent container inline. */
  fullScreen?: boolean
  /** Optional message displayed below the animation in slate gray. */
  message?: string
  /** Controls animation size: sm=120px, md=200px, lg=300px. Defaults to 'md'. */
  size?: "sm" | "md" | "lg"
}

const SIZE_MAP: Record<NonNullable<LoadingScreenProps["size"]>, number> = {
  sm: 120,
  md: 200,
  lg: 300,
}

export function LoadingScreen({
  fullScreen = true,
  message,
  size = "md",
}: LoadingScreenProps) {
  const dimension = SIZE_MAP[size]

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div style={{ width: dimension, height: dimension }}>
        <Lottie animationData={animationData} loop autoplay />
      </div>
      {message && (
        <p className="text-sm text-[#4A5568]">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {content}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center py-8">
      {content}
    </div>
  )
}

export default LoadingScreen
