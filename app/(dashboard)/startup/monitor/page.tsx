import { redirect } from "next/navigation"

export default function MonitorRedirectPage() {
  redirect("/dashboard/alerts")
}
