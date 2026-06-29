'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { trackEvent } from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';

export default function BlogDigestsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = trpc.blogAutomation.adminListEditorialDigests.useQuery({ page, limit: 10 });
  
  const generateMutation = trpc.blogAutomation.adminGenerateEditorialDigest.useMutation({
    onSuccess: () => {
      refetch();
      trackEvent('blog_automation_digest_generated', {
        blog_automation_action: 'generate_digest',
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Weekly Editorial Digests</h1>
        <Button onClick={() => generateMutation.mutate({})} disabled={generateMutation.isPending}>
          {generateMutation.isPending ? 'Generating...' : 'Generate Digest'}
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading && <p>Loading...</p>}
        {data?.items.map((digest) => (
          <Card key={digest.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Digest: {format(new Date(digest.periodStart), 'MMM d, yyyy')} - {format(new Date(digest.periodEnd), 'MMM d, yyyy')}
              </CardTitle>
              <Link href={`/admin/content/blog/digests/${digest.id}`}>
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Items Discovered</span>
                  <span className="text-xl font-bold">{digest.sourceItemsDiscovered}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">High Priority Suggestions</span>
                  <span className="text-xl font-bold text-blue-600">{digest.highPrioritySuggestions}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Awaiting Drafts</span>
                  <span className="text-xl font-bold text-amber-600">{digest.approvedAwaitingDraft}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Blocked Drafts</span>
                  <span className="text-xl font-bold text-red-600">{digest.blockedDrafts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
