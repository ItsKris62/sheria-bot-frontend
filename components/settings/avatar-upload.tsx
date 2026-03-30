'use client'

import { useRef, useState } from 'react'
import { Camera, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { trpc } from '@/lib/trpc'

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const AVATAR_MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
type AvatarMimeType = (typeof AVATAR_MIME_TYPES)[number]

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface AvatarUploadProps {
  user: { name: string | null; avatar: string | null }
}

/* -------------------------------------------------------------------------- */
/*                               Validation                                   */
/* -------------------------------------------------------------------------- */

function validateAvatarFile(file: File): string | null {
  if (!AVATAR_MIME_TYPES.includes(file.type as AvatarMimeType)) {
    return 'Please select a JPEG, PNG, or WebP image.'
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return 'Image must be smaller than 5 MB.'
  }
  return null
}

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

/**
 * Avatar upload widget for the Settings > Profile page.
 *
 * Upload flow:
 * 1. User picks a file — validated client-side, then shown as an optimistic preview.
 * 2. `getAvatarUploadUrl` → presigned PUT URL from the backend.
 * 3. Browser PUT directly to R2 (never through the backend).
 * 4. `confirmAvatarUpload` → backend writes the public URL to the DB.
 * 5. Profile cache is invalidated so the header + page reflect the new avatar.
 */
export function AvatarUpload({ user }: AvatarUploadProps) {
  const utils = trpc.useUtils()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // `preview` holds either a local objectUrl (during upload) or the confirmed
  // public R2 URL (after success). Takes priority over `user.avatar`.
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const getUploadUrl = trpc.user.getAvatarUploadUrl.useMutation()
  const confirmUpload = trpc.user.confirmAvatarUpload.useMutation()
  const deleteAvatarMutation = trpc.user.deleteAvatar.useMutation()

  // What the avatar display actually renders — preview takes priority
  const displayUser = { name: user.name, avatar: preview ?? user.avatar }
  const hasAvatar = !!(preview ?? user.avatar)

  /* ─── File selection ──────────────────────────────────────────────────── */

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset so selecting the same file again fires onChange
    e.target.value = ''

    const validationError = validateAvatarFile(file)
    if (validationError) {
      toast.error(validationError)
      return
    }

    // Optimistic preview — shows immediately while uploading
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsUploading(true)

    try {
      // Step 1 — Get presigned PUT URL
      const { uploadUrl, publicUrl } = await getUploadUrl.mutateAsync({
        contentType: file.type as AvatarMimeType,
        fileSize: file.size,
      })

      // Step 2 — Upload directly to R2
      const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!putResponse.ok) {
        throw new Error(`Upload failed with status ${putResponse.status}`)
      }

      // Step 3 — Persist public URL in DB
      await confirmUpload.mutateAsync({ publicUrl })

      // Swap preview from the temporary objectUrl to the permanent R2 URL
      // so the avatar stays visible while the profile cache refetches.
      URL.revokeObjectURL(objectUrl)
      setPreview(publicUrl)

      // Step 4 — Refresh profile query (header + page pick up new avatar)
      utils.user.getProfile.invalidate()

      toast.success('Profile photo updated.')
    } catch (err: unknown) {
      URL.revokeObjectURL(objectUrl)
      setPreview(null)
      const msg = err instanceof Error ? err.message : 'Failed to upload photo'
      toast.error(msg)
    } finally {
      setIsUploading(false)
    }
  }

  /* ─── Delete ──────────────────────────────────────────────────────────── */

  async function handleDelete() {
    setIsUploading(true)
    try {
      await deleteAvatarMutation.mutateAsync()
      setPreview(null)
      utils.user.getProfile.invalidate()
      toast.success('Profile photo removed.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove photo'
      toast.error(msg)
    } finally {
      setIsUploading(false)
    }
  }

  /* ─── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar with loading overlay */}
      <div className="relative">
        <UserAvatar user={displayUser} size="xl" />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={openFilePicker}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          {hasAvatar ? 'Change Photo' : 'Upload Photo'}
        </Button>

        {hasAvatar && !isUploading && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-1.5 h-3 w-3" />
            Remove
          </Button>
        )}

        <p className="text-xs text-muted-foreground">JPEG, PNG, WebP — max 5 MB</p>
      </div>
    </div>
  )
}
