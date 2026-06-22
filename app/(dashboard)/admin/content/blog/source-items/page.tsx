'use client';

import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, CheckCircle2, XCircle, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogSourceItemsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('ALL');

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data, isLoading, refetch } = trpc.blogAutomation.adminListSourceItems.useQuery(
    {
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter !== 'ALL' ? (statusFilter as any) : undefined,
      jurisdiction: jurisdictionFilter !== 'ALL' ? (jurisdictionFilter as any) : undefined,
    }
  );

  const dismissMutation = trpc.blogAutomation.adminDismissSourceItem.useMutation({
    onSuccess: () => {
      toast.success('Source item dismissed');
      setIsDrawerOpen(false);
      refetch();
    },
    onError: (err: any) => {
      toast.error(`Failed to dismiss: ${err.message}`);
    },
  });

  const scoreMutation = trpc.blogAutomation.adminScoreSourceItem.useMutation({
    onSuccess: (res: any) => {
      if (res.createdSuggestion) {
        toast.success('Suggestion created successfully!');
      } else {
        toast.info(`Scored ${res.scoringResult.relevanceScore}/100. Below threshold or duplicate.`);
      }
      setIsDrawerOpen(false);
      refetch();
    },
    onError: (err: any) => {
      toast.error(`Failed to score: ${err.message}`);
    },
  });

  const handleDismiss = () => {
    if (!selectedItem) return;
    const reason = prompt('Reason for dismissal?');
    if (!reason) return;
    dismissMutation.mutate({ id: selectedItem.id, reason });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Source Items</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Source items are discovered regulatory updates. They are not blog suggestions yet.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search source items..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="READY_FOR_SCORING">Ready for Scoring</SelectItem>
              <SelectItem value="SCORED">Scored</SelectItem>
              <SelectItem value="DUPLICATE">Duplicate</SelectItem>
              <SelectItem value="DISMISSED">Dismissed</SelectItem>
              <SelectItem value="FETCH_FAILED">Fetch Failed</SelectItem>
              <SelectItem value="CONVERTED_TO_SUGGESTION">Converted to Suggestion</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={jurisdictionFilter}
            onValueChange={(val) => {
              setJurisdictionFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Jurisdictions</SelectItem>
              <SelectItem value="KE">Kenya</SelectItem>
              <SelectItem value="NG">Nigeria</SelectItem>
              <SelectItem value="RW">Rwanda</SelectItem>
              <SelectItem value="MW">Malawi</SelectItem>
              <SelectItem value="REGIONAL">Regional</SelectItem>
              <SelectItem value="GLOBAL">Global</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Monitor</TableHead>
                <TableHead>Source Type</TableHead>
                <TableHead>Authority Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Discovered At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Loading source items...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No source items found. Run discovery on a monitor to fetch items.
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[300px] truncate" title={item.title}>
                      {item.title}
                    </TableCell>
                    <TableCell>{item.jurisdiction}</TableCell>
                    <TableCell>{item.monitor.name}</TableCell>
                    <TableCell>{item.sourceType}</TableCell>
                    <TableCell>{item.authorityType}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'NEW' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.publicationDate ? new Date(item.publicationDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{new Date(item.discoveredAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-2 hover:bg-muted rounded-md"
                        title="Open Source URL"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDrawerOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data && data.pagination.pages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={page === data.pagination.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Source Item Details</SheetTitle>
            <SheetDescription>
              Discovered from {selectedItem?.monitor?.name}
            </SheetDescription>
          </SheetHeader>

          {selectedItem && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-muted-foreground">Title</span>
                <span className="text-base">{selectedItem.title}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-muted-foreground">URL</span>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1 break-all"
                >
                  {selectedItem.url} <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-muted-foreground">Normalized URL</span>
                <span className="text-sm break-all font-mono bg-muted p-2 rounded-md">
                  {selectedItem.normalizedUrl}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-muted-foreground">Summary</span>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                  {selectedItem.summary || 'No summary extracted.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">Status</span>
                  <span><Badge>{selectedItem.status}</Badge></span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">Discovered At</span>
                  <span className="text-sm">{new Date(selectedItem.discoveredAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">Published Date</span>
                  <span className="text-sm">
                    {selectedItem.publicationDate
                      ? new Date(selectedItem.publicationDate).toLocaleDateString()
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-muted-foreground">Publisher</span>
                  <span className="text-sm">{selectedItem.publisher || '-'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-muted-foreground">Content Hash</span>
                <span className="text-xs font-mono bg-muted p-2 rounded-md truncate">
                  {selectedItem.contentHash}
                </span>
              </div>

              {selectedItem.failureReason && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-red-500">Failure Reason</span>
                  <span className="text-sm text-red-500">{selectedItem.failureReason}</span>
                </div>
              )}

              {selectedItem.dismissedReason && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-orange-500">Dismissed Reason</span>
                  <span className="text-sm text-orange-500">{selectedItem.dismissedReason}</span>
                </div>
              )}

              <div className="pt-4 border-t flex justify-end gap-2">
                {['NEW', 'READY_FOR_SCORING', 'SCORED'].includes(selectedItem.status) && (
                  <Button 
                    className="bg-secondary hover:bg-[#007a50] text-white" 
                    onClick={() => scoreMutation.mutate({ sourceItemId: selectedItem.id })}
                    disabled={scoreMutation.isPending}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Score & Suggest
                  </Button>
                )}
                {selectedItem.status !== 'DISMISSED' && (
                  <Button variant="destructive" onClick={handleDismiss} disabled={dismissMutation.isPending}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Dismiss Item
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
