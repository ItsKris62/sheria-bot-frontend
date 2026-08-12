"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function KnowledgeBaseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Knowledge Base route error", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center bg-[#050706] px-4 py-16 sm:px-6 lg:px-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Knowledge Base could not be loaded</AlertTitle>
        <AlertDescription>
          <p>The content service did not respond successfully. Please try again.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={reset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/knowledge-base">Back to Knowledge Base</Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
