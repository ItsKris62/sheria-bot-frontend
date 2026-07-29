"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"

export default function ContentOpsAlertDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data, isLoading } = trpc.blogAutomation.adminGetContentOpsAlert.useQuery({ id: params.id as string })

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
  if (!data) return <div className="p-8 text-center text-red-500">Alert not found</div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push("/admin/content/editorial/alerts")}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <h1 className="text-3xl font-bold">Content Ops Alert {data.id.slice(0, 8)}</h1>
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
