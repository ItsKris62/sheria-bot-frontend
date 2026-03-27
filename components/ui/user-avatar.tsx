'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface UserAvatarUser {
  name: string | null
  avatar: string | null
}

export interface UserAvatarProps {
  user: UserAvatarUser
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/* -------------------------------------------------------------------------- */
/*                               Size Maps                                    */
/* -------------------------------------------------------------------------- */

const SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
} as const

const TEXT_SIZE_CLASSES = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
} as const

/* -------------------------------------------------------------------------- */
/*                               Pure Helper                                  */
/* -------------------------------------------------------------------------- */

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  const word = parts[0]
  return word.length >= 2 ? word.slice(0, 2).toUpperCase() : word[0].toUpperCase()
}

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

/**
 * Displays a user's avatar image with an initials fallback.
 *
 * - Shows the image from `user.avatar` when set.
 * - Falls back automatically to initials (via Radix AvatarFallback) when the
 *   image URL is null or the image fails to load.
 *
 * Sizes: sm = 32px · md = 40px · lg = 56px · xl = 80px
 */
export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  const initials = getInitials(user.name)

  return (
    <Avatar className={cn(SIZE_CLASSES[size], 'shrink-0', className)}>
      {user.avatar && (
        <AvatarImage
          src={user.avatar}
          alt={user.name ?? 'User avatar'}
          className="object-cover"
        />
      )}
      <AvatarFallback
        className={cn(
          'font-semibold text-white',
          TEXT_SIZE_CLASSES[size],
          // Deep Navy — matches SheriaBot brand
          'bg-[#1A2B4A]',
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
