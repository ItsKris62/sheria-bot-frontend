import React from "react"
import { PublicShell } from "@/components/layout/public-shell"
import "@/components/marketing/marketing.css"

export default function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal?: React.ReactNode
}) {
  return (
    <>
      <PublicShell>{children}</PublicShell>
      {modal}
    </>
  )
}
