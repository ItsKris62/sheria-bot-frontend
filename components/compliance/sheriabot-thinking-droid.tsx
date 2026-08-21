"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { StreamState } from "@/hooks/use-compliance";
import { ThinkingIndicator } from "@/components/compliance/thinking-indicator";
import { jurisdictionLabel, type JurisdictionCode } from "@/lib/jurisdictions";

const MASCOT_PATH = "/mascots/sheriabot-droid/compliance-query/v1";

const getFrames = () => {
  const ASSET_BASE_URL = process.env.NEXT_PUBLIC_R2_ASSETS_URL || "";
  return {
    FOCUS: `${ASSET_BASE_URL}${MASCOT_PATH}/sheriabot-droid-thinking-01-focus.webp`,
    SEARCHING: `${ASSET_BASE_URL}${MASCOT_PATH}/sheriabot-droid-thinking-02-searching.webp`,
    READING: `${ASSET_BASE_URL}${MASCOT_PATH}/sheriabot-droid-thinking-03-reading.webp`,
    PROCESSING: `${ASSET_BASE_URL}${MASCOT_PATH}/sheriabot-droid-thinking-04-processing.webp`,
    VERIFYING: `${ASSET_BASE_URL}${MASCOT_PATH}/sheriabot-droid-thinking-05-verifying.webp`,
    READY: `${ASSET_BASE_URL}${MASCOT_PATH}/sheriabot-droid-thinking-06-ready.webp`,
  };
};

const FRAME_INTERVAL_MS = 700;

interface SheriaBotThinkingDroidProps {
  state: StreamState;
  query: string;
  jurisdictionCode?: JurisdictionCode;
}

export function SheriaBotThinkingDroid({ state, query, jurisdictionCode }: SheriaBotThinkingDroidProps) {
  const [frameState, setFrameState] = useState({ phase: state.phase, index: 0 });
  const [imageError, setImageError] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const frames = useMemo(() => getFrames(), []);

  // Preload images on mount
  useEffect(() => {

    const preloadImages = (urls: string[]) => {
      urls.forEach((url) => {
        const img = new globalThis.Image();
        img.src = url;
      });
    };

    // Preload connecting frames immediately
    preloadImages([frames.FOCUS, frames.SEARCHING]);

    // Preload the rest asynchronously without blocking
    if (typeof window !== "undefined") {
      const idleCallback = window.requestIdleCallback || ((cb: any) => setTimeout(cb, 1000));
      idleCallback(() => {
        preloadImages([frames.READING, frames.PROCESSING, frames.VERIFYING, frames.READY]);
      });
    }
  }, [frames]);

  const sequence = useMemo(() => {
    switch (state.phase) {
      case "connecting":
        return [frames.FOCUS, frames.SEARCHING];
      case "streaming":
        return [frames.SEARCHING, frames.READING, frames.PROCESSING];
      case "verifying":
        return [frames.PROCESSING, frames.VERIFYING];
      case "complete":
        return [frames.READY];
      case "error":
      case "idle":
      default:
        return [frames.FOCUS];
    }
  }, [state.phase, frames]);

  // Handle frame cycling
  useEffect(() => {
    if (sequence.length <= 1) {
      return;
    }

    let intervalId: NodeJS.Timeout;
    
    // Check for reduced motion safely
    const prefersReducedMotion = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (!prefersReducedMotion) {
      intervalId = setInterval(() => {
        setFrameState((prev) => ({
          phase: state.phase,
          index: prev.phase === state.phase ? (prev.index + 1) % sequence.length : 1 % sequence.length,
        }));
      }, FRAME_INTERVAL_MS);
    }

    return () => clearInterval(intervalId);
  }, [sequence, state.phase]);

  // Fade out effect when complete
  useEffect(() => {
    if (state.phase === "complete") {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.phase]);

  const statusText = useMemo(() => {
    const country = jurisdictionLabel(jurisdictionCode);
    switch (state.phase) {
      case "connecting":
        return `Searching verified ${country} regulatory sources...`;
      case "streaming":
        return `Reviewing ${country} regulatory evidence...`;
      case "verifying":
        return `Verifying against ${country} regulatory sources...`;
      case "complete":
        return "Answer ready";
      default:
        return "Thinking...";
    }
  }, [jurisdictionCode, state.phase]);

  const frameIndex = frameState.phase === state.phase ? frameState.index : 0;
  const currentFrameUrl = sequence[frameIndex % sequence.length] || frames.FOCUS;
  const shouldFadeOut = state.phase === "complete" && isFadingOut;

  if (state.phase === "idle" || state.phase === "error") {
    return null;
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-start gap-4 transition-opacity duration-500 ease-in-out",
        shouldFadeOut ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
      )}
      aria-live="polite"
    >
      {state.phase !== "complete" && <span className="sr-only">Thinking</span>}
      {imageError ? (
        <ThinkingIndicator query={query} />
      ) : (
        <div className="flex items-center gap-4 bg-transparent pt-2 pb-4 w-full">
          {/* Mascot Image Container */}
          <div className="relative shrink-0 w-[88px] h-[88px] md:w-[112px] md:h-[112px] lg:w-[130px] lg:h-[130px]">
            {/* Optional subtle glow based on state */}
            <div className={cn(
              "absolute inset-0 bg-emerald-500/20 blur-xl rounded-full transition-opacity duration-1000",
              (state.phase === "verifying" || state.phase === "complete") ? "opacity-100" : "opacity-0"
            )} />
            
            <div className={cn(
              "relative w-full h-full transition-transform duration-1000",
              // Gentle bobbing animation only when not in reduced motion and not in complete/error
              "motion-safe:animate-[bob_4s_ease-in-out_infinite]",
              state.phase === "complete" && "motion-safe:animate-none"
            )}>
              {/* We use standard img to ensure pixelated rendering works correctly across browsers 
                  without Next.js Image optimization modifying the pixel art */}
              <img
                src={currentFrameUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-contain [image-rendering:pixelated]"
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          {/* Status Text */}
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">SheriaBot</span>
              <span className="text-[10px] text-muted-foreground/80 uppercase tracking-wider font-medium">
                {state.phase === "verifying" ? "Verifying" : state.phase === "complete" ? "Complete" : "Processing"}
              </span>
            </div>
            <span className="text-sm text-muted-foreground leading-relaxed font-medium">
              {statusText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
