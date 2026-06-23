"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Trash2, Plus, AlertTriangle, CheckCircle2, XCircle, Sparkles, Shield, ShieldCheck, ShieldAlert } from "lucide-react"

export default function BlogEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const utils = trpc.useUtils()
  
  const { data: post, isLoading } = trpc.blog.adminGetById.useQuery({ id: params.id })
  
  const { data: latestVerificationResponse, refetch: refetchVerification } = trpc.blogAutomation.adminGetLatestBlogVerification.useQuery({ blogPostId: params.id })
  const latestVerification = latestVerificationResponse?.run
  const isStale = latestVerificationResponse?.isStale || false
  const isAiStale = latestVerificationResponse?.isAiStale || false

  const verificationMutation = trpc.blogAutomation.adminRunBlogVerification.useMutation({
    onSuccess: (res: any) => {
      toast.success(`Verification completed: ${res.status}`)
      refetchVerification()
    },
    onError: (err: any) => toast.error(err.message),
  })
  
  const updateMutation = trpc.blog.adminUpdate.useMutation({
    onSuccess: () => {
      toast.success("Saved successfully")
      void utils.blog.adminGetById.invalidate({ id: params.id })
    },
    onError: (err) => toast.error(err.message),
  })

  const publishMutation = trpc.blog.adminSetStatus.useMutation({
    onSuccess: () => {
      toast.success("Published successfully")
      void utils.blog.adminGetById.invalidate({ id: params.id })
    },
    onError: (err) => toast.error(err.message),
  })

  const aiDraftMutation = trpc.blogAutomation.adminGenerateAiDraft.useMutation({
    onSuccess: (res) => {
      toast.success("AI draft generation successful")
      if (res.reviewerNotes) {
        toast.info("AI Notes: " + res.reviewerNotes)
      }
      void utils.blog.adminGetById.invalidate({ id: params.id })
    },
    onError: (err) => toast.error(err.message),
  })

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    category: "",
    jurisdiction: "Kenya",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImageUrl: "",
  })

  const [sources, setSources] = useState<any[]>([])

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        coverImageUrl: post.coverImageUrl || "",
        category: post.category || "",
        jurisdiction: post.jurisdiction || "Kenya",
        featured: post.featured || false,
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
        canonicalUrl: post.canonicalUrl || "",
        ogImageUrl: post.ogImageUrl || "",
      })
      setSources(post.sources || [])
    }
  }, [post])

  const handleSave = () => {
    updateMutation.mutate({
      id: params.id,
      ...form,
      sources,
    })
  }

  const handleAddSource = () => {
    setSources([...sources, { sourceType: "OFFICIAL", title: "", publisher: "", url: "" }])
  }

  const updateSource = (index: number, key: string, value: string) => {
    const newSources = [...sources]
    newSources[index][key] = value
    setSources(newSources)
  }

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  if (isLoading) return <div className="p-6">Loading editor...</div>
  if (!post) return <div className="p-6">Post not found</div>

  const needsOfficialSource = ["Regulatory Updates", "Enforcement & Penalties"].includes(form.category)
  const hasOfficialSource = sources.some(s => ["OFFICIAL", "INTERNATIONAL_STANDARD"].includes(s.sourceType))

  const googleTitle = form.seoTitle || form.title || "Untitled"
  const googleDescription = form.seoDescription || form.excerpt || "No description provided."
  const googleUrl = form.canonicalUrl || `https://sheriabot.com/blog/${form.slug}`

  const isVerificationBlocked = latestVerification ? latestVerification.status === "BLOCKED" : false

  const publishChecks = [
    { label: "Title present", passed: !!form.title },
    { label: "Slug present", passed: !!form.slug },
    { label: "Excerpt present", passed: !!form.excerpt },
    { label: "Content present", passed: !!form.content },
    { label: "Category selected", passed: !!form.category },
    { label: "At least 1 source", passed: sources.length > 0 },
    { label: "Official source (if req)", passed: !needsOfficialSource || hasOfficialSource },
    { label: "Image available", passed: !!(form.coverImageUrl || form.ogImageUrl) },
    { label: "Verification Passed/Needs Review", passed: latestVerification ? !isVerificationBlocked : false },
    { label: "AI draft not stale", passed: !isAiStale },
  ]
  
  const isPublishReady = publishChecks.every(c => c.passed)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/content/blog")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Blog Post</h1>
            <p className="text-sm text-gray-500">Status: {post.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.status !== 'PUBLISHED' && (
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!isPublishReady || updateMutation.isPending || publishMutation.isPending}
              onClick={() => {
                publishMutation.mutate({
                  id: params.id,
                  status: 'PUBLISHED'
                })
              }}
            >
              Publish
            </Button>
          )}
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-secondary hover:bg-[#007a50]">
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Body (Markdown)</Label>
                <Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={20} className="font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sources & References</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAddSource}><Plus className="w-4 h-4 mr-2" /> Add Source</Button>
              </div>
              {needsOfficialSource && !hasOfficialSource && (
                <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm bg-amber-50 p-2 rounded">
                  <AlertTriangle className="w-4 h-4" /> {form.category} requires an OFFICIAL source to publish.
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {sources.map((source, i) => (
                <div key={i} className="border p-4 rounded-md relative grid grid-cols-2 gap-4">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500" onClick={() => removeSource(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={source.sourceType} onValueChange={v => updateSource(i, "sourceType", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OFFICIAL">Official</SelectItem>
                        <SelectItem value="THIRD_PARTY">Third Party</SelectItem>
                        <SelectItem value="INTERNAL">Internal</SelectItem>
                        <SelectItem value="MEDIA">Media</SelectItem>
                        <SelectItem value="INTERNATIONAL_STANDARD">International Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={source.title} onChange={e => updateSource(i, "title", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Publisher</Label>
                    <Input value={source.publisher} onChange={e => updateSource(i, "publisher", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input value={source.url} onChange={e => updateSource(i, "url", e.target.value)} />
                  </div>
                </div>
              ))}
              {sources.length === 0 && <p className="text-gray-500 text-sm italic">No sources added yet.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {(post.status === "DRAFT" || post.status === "IN_REVIEW") && (
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Assisted Drafting
                </CardTitle>
                <CardDescription>
                  Generate markdown content automatically using attached sources. Existing content will be overwritten.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => aiDraftMutation.mutate({ blogPostId: post.id })}
                  disabled={aiDraftMutation.isPending || sources.length === 0}
                >
                  {aiDraftMutation.isPending ? "Generating..." : "Generate Draft"}
                </Button>
                {sources.length === 0 && (
                  <p className="text-xs text-red-500 mt-2 text-center">At least 1 source is required to use AI generation.</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card className={latestVerification?.status === 'BLOCKED' ? "border-red-500/50" : latestVerification?.status === 'PASSED' ? "border-green-500/50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {latestVerification?.status === 'PASSED' ? <ShieldCheck className="w-5 h-5 text-green-500" /> : latestVerification?.status === 'BLOCKED' ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <Shield className="w-5 h-5" />}
                Source & Claim Verification
              </CardTitle>
              <CardDescription>
                {latestVerification ? `Last run: ${new Date(latestVerification.createdAt).toLocaleString()}` : "No verification run yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestVerification && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Status:</span> <span className="font-bold">{latestVerification.status}</span></div>
                  <div className="flex justify-between"><span>Quality Score:</span> <span>{latestVerification.qualityScore}/100</span></div>
                  {latestVerification.summary && <p className="text-xs text-muted-foreground mt-2">{latestVerification.summary}</p>}
                  
                  {latestVerification.issues && latestVerification.issues.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-xs uppercase text-muted-foreground">Issues</h4>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {latestVerification.issues.map((issue: any) => (
                          <div key={issue.id} className={`p-2 text-xs rounded border ${issue.severity === 'BLOCKING' ? 'bg-red-50 border-red-200 text-red-800' : issue.severity === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                            <strong>[{issue.severity}] {issue.title}</strong>
                            <p className="mt-1">{issue.description}</p>
                            {issue.excerpt && <p className="mt-1 italic text-[10px]">"{issue.excerpt}"</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isStale && !isAiStale && (
                <div className="mt-2 text-amber-600 text-xs bg-amber-50 p-2 rounded flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  This verification may be outdated because the article or its sources were modified after the run.
                </div>
              )}
              {isAiStale && (
                <div className="mt-2 text-red-600 text-xs bg-red-50 p-2 rounded flex gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  An AI draft was generated after the last verification run. You must run verification again before publishing.
                </div>
              )}
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => verificationMutation.mutate({ blogPostId: params.id })}
                disabled={verificationMutation.isPending || sources.length === 0}
              >
                {verificationMutation.isPending ? "Running..." : "Run Verification"}
              </Button>
            </CardContent>
          </Card>

          <Card className={isPublishReady ? "border-green-500/50" : "border-amber-500/50"}>
            <CardHeader>
              <CardTitle>Publish Readiness</CardTitle>
              <CardDescription>Requirements to publish this post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {publishChecks.map((check, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>{check.label}</span>
                  {check.passed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                </div>
              ))}
              {isStale && !isAiStale && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <span className="text-amber-600">Verification is stale</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
              )}
            </CardContent>
          </Card>

          {post.automationSuggestion && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="text-blue-800 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Automation Origin
                </CardTitle>
                <CardDescription className="text-xs">
                  This draft was created from an automated suggestion.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-muted-foreground block mb-1">Suggestion ID:</span>
                  <span className="font-mono">{post.automationSuggestion.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground block mb-1">Reason:</span>
                  <span className="line-clamp-2">{post.automationSuggestion.reason || "N/A"}</span>
                </div>
                {post.automationSuggestion.sources && post.automationSuggestion.sources.length > 0 && (
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Source Monitors:</span>
                    <ul className="list-disc list-inside space-y-1">
                      {post.automationSuggestion.sources.map((s: any) => (
                        <li key={s.sourceItemId} className="truncate">
                          {s.sourceItem?.monitor?.name || "Unknown Monitor"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-blue-600"
                  onClick={() => router.push(`/admin/content/blog/suggestions?search=${post.automationSuggestion.id}`)}
                >
                  View Original Suggestion →
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Jurisdiction</Label>
                <Input value={form.jurisdiction} onChange={e => setForm({...form, jurisdiction: e.target.value})} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured Post</Label>
                <Switch checked={form.featured} onCheckedChange={c => setForm({...form, featured: c})} />
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input value={form.coverImageUrl} onChange={e => setForm({...form, coverImageUrl: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO Optimization</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input value={form.canonicalUrl} onChange={e => setForm({...form, canonicalUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Open Graph Image URL</Label>
                <Input value={form.ogImageUrl} onChange={e => setForm({...form, ogImageUrl: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Search & Social Previews</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Google Preview</Label>
                <div className="p-4 bg-white border rounded shadow-sm text-sm font-sans">
                  <div className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate">{googleTitle}</div>
                  <div className="text-[#006621] text-xs truncate">{googleUrl}</div>
                  <div className="text-[#545454] mt-1 text-xs line-clamp-2">{googleDescription}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Social Preview (X / LinkedIn)</Label>
                <div className="border rounded overflow-hidden shadow-sm bg-card text-sm">
                  {(form.ogImageUrl || form.coverImageUrl) ? (
                    <img src={form.ogImageUrl || form.coverImageUrl} alt="OG" className="w-full h-[150px] object-cover" />
                  ) : (
                    <div className="w-full h-[150px] bg-muted flex items-center justify-center text-muted-foreground">No image available</div>
                  )}
                  <div className="p-3 bg-muted/30">
                    <div className="text-foreground font-semibold truncate">{googleTitle}</div>
                    <div className="text-muted-foreground text-xs line-clamp-1">{googleDescription}</div>
                    <div className="text-muted-foreground text-[10px] mt-1 uppercase">sheriabot.com</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
