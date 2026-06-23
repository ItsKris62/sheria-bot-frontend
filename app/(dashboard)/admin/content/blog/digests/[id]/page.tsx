'use client';

import { trpc } from '@/lib/trpc';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Link from 'next/link';

export default function BlogDigestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: digest, isLoading } = trpc.blogAutomation.adminGetEditorialDigest.useQuery({ id }, { enabled: !!id });

  if (isLoading) return <div>Loading...</div>;
  if (!digest) return <div>Digest not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editorial Digest Detail</h1>
        <Link href="/admin/content/blog/digests" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back to Digests
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {format(new Date(digest.periodStart), 'MMM d, yyyy')} - {format(new Date(digest.periodEnd), 'MMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="flex flex-col border p-4 rounded-md">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">Monitors Checked</span>
                <span className="text-2xl font-bold">{digest.sourceMonitorsChecked}</span>
             </div>
             <div className="flex flex-col border p-4 rounded-md">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">Failing Monitors</span>
                <span className="text-2xl font-bold text-red-600">{digest.failingMonitors}</span>
             </div>
             <div className="flex flex-col border p-4 rounded-md">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">Items Discovered</span>
                <span className="text-2xl font-bold">{digest.sourceItemsDiscovered}</span>
             </div>
             <div className="flex flex-col border p-4 rounded-md bg-amber-50">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">High Priority</span>
                <span className="text-2xl font-bold text-amber-700">{digest.highPrioritySuggestions}</span>
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <div className="flex flex-col border p-4 rounded-md">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">Awaiting Drafts</span>
                <span className="text-2xl font-bold">{digest.approvedAwaitingDraft}</span>
             </div>
             <div className="flex flex-col border p-4 rounded-md">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">Pending Verification</span>
                <span className="text-2xl font-bold">{digest.draftsAwaitingVerification}</span>
             </div>
             <div className="flex flex-col border p-4 rounded-md bg-red-50">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">Blocked Drafts</span>
                <span className="text-2xl font-bold text-red-700">{digest.blockedDrafts}</span>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
