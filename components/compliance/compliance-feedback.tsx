'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import {
  Shield,
  FileText,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import {
  parseComplianceResponse,
  type ParsedSection,
  type SectionType,
  type ComplianceStatus,
} from '@/lib/utils/compliance-parser'

// ─── Section style config ──────────────────────────────────────────────────

interface SectionStyle {
  borderColor: string
  iconColor: string
  bgColor: string
  Icon: React.ComponentType<{ className?: string }>
}

const SECTION_STYLES: Record<SectionType, SectionStyle> = {
  summary: {
    borderColor: 'border-l-primary',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/5',
    Icon: Shield,
  },
  requirements: {
    borderColor: 'border-l-blue-500',
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/5',
    Icon: FileText,
  },
  recommendations: {
    borderColor: 'border-l-warning',
    iconColor: 'text-warning',
    bgColor: 'bg-warning/5',
    Icon: TrendingUp,
  },
  risk: {
    borderColor: 'border-l-destructive',
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/5',
    Icon: AlertTriangle,
  },
  monitoring: {
    borderColor: 'border-l-secondary',
    iconColor: 'text-secondary',
    bgColor: 'bg-secondary/5',
    Icon: RefreshCw,
  },
  general: {
    borderColor: 'border-l-border',
    iconColor: 'text-muted-foreground',
    bgColor: '',
    Icon: FileText,
  },
}

// ─── Status badge config ───────────────────────────────────────────────────

interface StatusStyle {
  label: string
  className: string
  Icon: React.ComponentType<{ className?: string }>
}

const STATUS_STYLES: Record<ComplianceStatus, StatusStyle> = {
  compliant: {
    label: 'Compliant',
    className: 'border-primary/40 bg-primary/10 text-primary',
    Icon: CheckCircle2,
  },
  'non-compliant': {
    label: 'Non-Compliant',
    className: 'border-destructive/40 bg-destructive/10 text-destructive',
    Icon: XCircle,
  },
  'partially-compliant': {
    label: 'Partially Compliant',
    className: 'border-warning/40 bg-warning/10 text-warning',
    Icon: AlertCircle,
  },
  warning: {
    label: 'Attention Required',
    className: 'border-warning/40 bg-warning/10 text-warning',
    Icon: AlertTriangle,
  },
}

// ─── Ordered-list context ──────────────────────────────────────────────────
// react-markdown v10 removed the `ordered` prop from `li`.
// We pass the list type via context from the ul/ol parent component.

const OrderedContext = createContext(false)

// ─── Markdown content renderer ─────────────────────────────────────────────
// Uses react-markdown + remark-gfm for proper GFM table, heading, and list
// rendering with design-system-aligned styling.

// Stable plugin array — must be outside the component or memoised to avoid
// react-markdown re-processing the AST on every render.
const GFM_PLUGINS = [remarkGfm]

function MarkdownContent({ content, compact = false }: { content: string; compact?: boolean }) {
  const sz = compact ? 'text-xs' : 'text-sm'
  const tblSz = compact ? 'text-[11px]' : 'text-xs'

  const components = useMemo((): Components => {
    // ── List items — reads OrderedContext set by ul/ol parent ─────────────
    // Named function so React correctly identifies it as a component,
    // allowing the useContext hook call.
    function LiItem({ children }: React.LiHTMLAttributes<HTMLLIElement>) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const ordered = useContext(OrderedContext)
      if (ordered) {
        return (
          <li className={cn('text-foreground/80 leading-relaxed pl-1', sz)}>
            {children}
          </li>
        )
      }
      return (
        <li className="flex items-start gap-2.5 list-none">
          <span className={cn(
            'rounded-full bg-primary shrink-0',
            compact ? 'h-1 w-1 mt-[5px]' : 'h-1.5 w-1.5 mt-[7px]',
          )} />
          <span className={cn('text-foreground/80 leading-relaxed', sz)}>{children}</span>
        </li>
      )
    }

    return {
      // ── Headings ──────────────────────────────────────────────────────
      h1: ({ children }) => (
        <p className={cn('font-bold text-foreground mt-4 mb-2 first:mt-0', compact ? 'text-sm' : 'text-base')}>
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <p className={cn('font-semibold text-foreground mt-4 mb-2 first:mt-0', compact ? 'text-xs' : 'text-sm')}>
          {children}
        </p>
      ),
      h3: ({ children }) => (
        <p className={cn(
          'font-semibold text-foreground mt-3 mb-1.5 first:mt-0 flex items-center gap-1.5',
          sz,
        )}>
          <span className="w-1 h-3 rounded-full bg-primary/60 inline-block shrink-0" />
          {children}
        </p>
      ),
      h4: ({ children }) => (
        <p className={cn(
          'font-medium text-foreground/90 mt-2 mb-1 uppercase tracking-wide',
          compact ? 'text-[10px]' : 'text-[11px]',
        )}>
          {children}
        </p>
      ),

      // ── Body text ──────────────────────────────────────────────────────
      p: ({ children }) => (
        <p className={cn('text-foreground/80 leading-[1.7] my-1.5', sz)}>{children}</p>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      em: ({ children }) => (
        <em className="italic text-foreground/60">{children}</em>
      ),
      code: ({ children }) => (
        <code className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded text-[0.875em]">
          {children}
        </code>
      ),
      hr: () => <hr className="my-4 border-border/30" />,
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-primary/40 pl-3 italic text-foreground/60 my-3">
          {children}
        </blockquote>
      ),

      // ── Lists ──────────────────────────────────────────────────────────
      ul: ({ children }) => (
        <OrderedContext.Provider value={false}>
          <ul className={cn('my-2 space-y-1.5 list-none pl-0', compact ? 'space-y-1' : '')}>
            {children}
          </ul>
        </OrderedContext.Provider>
      ),
      ol: ({ children }) => (
        <OrderedContext.Provider value={true}>
          <ol className={cn(
            'my-2 list-decimal pl-5 space-y-1.5',
            compact ? 'space-y-1' : '',
            '[&>li::marker]:text-primary [&>li::marker]:font-semibold',
          )}>
            {children}
          </ol>
        </OrderedContext.Provider>
      ),
      li: LiItem,

      // ── GFM Tables ────────────────────────────────────────────────────
      // min-w-[480px] guarantees the inner table always has a sensible width
      // so the outer overflow-x-auto scroll kicks in rather than the table
      // compressing columns to unreadable widths inside narrow chat bubbles.
      // Row striping uses foreground-relative opacity so it stays visible
      // on any background colour (muted, card, white, dark, etc.).
      table: ({ children }) => (
        <div className="my-3 w-full overflow-x-auto rounded-md border border-border/60 shadow-sm">
          <table className="w-full min-w-[480px] text-left border-collapse">{children}</table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="border-b-2 border-border/60 bg-primary/5">{children}</thead>
      ),
      tbody: ({ children }) => <tbody className="divide-y divide-border/30">{children}</tbody>,
      tr: ({ children }) => (
        <tr className="even:bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-colors duration-100">
          {children}
        </tr>
      ),
      th: ({ children }) => (
        <th className={cn(
          'px-3 py-2.5 font-semibold text-foreground tracking-wide',
          compact ? 'text-[10px] uppercase' : 'text-xs uppercase',
        )}>
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className={cn('px-3 py-2 text-foreground/80 align-top break-words', tblSz)}>
          {children}
        </td>
      ),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact])

  return (
    <Markdown remarkPlugins={GFM_PLUGINS} components={components}>
      {content}
    </Markdown>
  )
}

// ─── Section renderer ──────────────────────────────────────────────────────

interface SectionProps {
  section: ParsedSection
  compact: boolean
  collapsible: boolean
}

function SectionRenderer({ section, compact, collapsible }: SectionProps) {
  const [open, setOpen] = useState(true)
  const style = SECTION_STYLES[section.type]
  const statusStyle = section.status ? STATUS_STYLES[section.status] : null

  const body = (
    <div className={cn(
      'border-t border-border/30',
      compact ? 'px-4 pb-3 pt-2.5' : 'px-4 pb-4 pt-3',
    )}>
      <MarkdownContent content={section.rawContent} compact={compact} />
    </div>
  )

  // No title: render content inline, no card chrome
  if (!section.title) {
    return <MarkdownContent content={section.rawContent} compact={compact} />
  }

  const { Icon } = style

  const header = (
    <div className={cn(
      'flex items-center justify-between gap-3 px-4',
      compact ? 'py-2.5' : 'py-3',
    )}>
      <div className="flex items-center gap-2 min-w-0">
        <Icon className={cn('shrink-0', compact ? 'h-3.5 w-3.5' : 'h-4 w-4', style.iconColor)} />
        <span className={cn(
          'font-semibold text-foreground truncate',
          compact ? 'text-xs' : 'text-sm',
        )}>
          {section.title}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {statusStyle && (
          <Badge
            variant="outline"
            className={cn(
              'gap-1 py-0 h-5',
              compact ? 'text-[10px]' : 'text-xs',
              statusStyle.className,
            )}
            aria-label={`Status: ${statusStyle.label}`}
          >
            <statusStyle.Icon className="h-3 w-3" />
            {!compact && statusStyle.label}
          </Badge>
        )}
        {collapsible && (
          <ChevronDown className={cn(
            'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
            open ? 'rotate-0' : '-rotate-90',
          )} />
        )}
      </div>
    </div>
  )

  const wrapperClass = cn(
    'rounded-lg border border-border/50 border-l-4 transition-colors',
    style.borderColor,
    style.bgColor,
  )

  if (collapsible) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className={wrapperClass}>
          <CollapsibleTrigger asChild>
            <button type="button" className="w-full text-left focus-visible:outline-none">
              {header}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>{body}</CollapsibleContent>
        </div>
      </Collapsible>
    )
  }

  return (
    <div className={wrapperClass}>
      {header}
      {body}
    </div>
  )
}

// ─── Chat-variant inline renderer ─────────────────────────────────────────
// Clean prose inside chat bubbles — no section card chrome.

function ChatSectionRenderer({ section }: { section: ParsedSection }) {
  return (
    <div className="space-y-1">
      {section.title && (
        <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mt-3 first:mt-0">
          {section.title}
        </p>
      )}
      <MarkdownContent content={section.rawContent} compact={true} />
    </div>
  )
}

// ─── Main public component ─────────────────────────────────────────────────

export interface ComplianceFeedbackProps {
  /** The raw markdown-style AI response string */
  content: string
  /**
   * Rendering variant:
   * - "report" — Full section cards with left border, icon, status badge.
   *              Best for detail pages with ample space.
   * - "chat"   — Clean inline prose without card chrome.
   *              Best for chat bubble contexts.
   */
  variant?: 'report' | 'chat'
  /**
   * When variant="report", allow sections to be collapsed by the user.
   * Defaults to false.
   */
  collapsible?: boolean
  /** Additional className on the root container */
  className?: string
}

/**
 * ComplianceFeedback renders AI compliance response text as a professional,
 * structured compliance report UI. It parses raw markdown into typed sections
 * and renders each section's body via react-markdown + remark-gfm, providing
 * correct GFM table, heading, and list rendering alongside enterprise-grade
 * section card styling (color-coded borders, icons, status badges).
 *
 * @example
 * // Full report mode (query detail pages, policy viewer)
 * <ComplianceFeedback content={answer} variant="report" collapsible />
 *
 * @example
 * // Chat mode (inside message bubbles)
 * <ComplianceFeedback content={message.content} variant="chat" />
 */
export function ComplianceFeedback({
  content,
  variant = 'report',
  collapsible = false,
  className,
}: ComplianceFeedbackProps) {
  const report = useMemo(() => parseComplianceResponse(content), [content])

  if (!report.sections.length) return null

  if (variant === 'chat') {
    return (
      <div className={cn('space-y-1', className)}>
        {report.sections.map((section) => (
          <ChatSectionRenderer key={section.id} section={section} />
        ))}
      </div>
    )
  }

  // report variant
  const isSingleUnnamed = report.sections.length === 1 && !report.sections[0].title

  if (isSingleUnnamed) {
    return (
      <div className={cn('', className)}>
        <MarkdownContent content={report.sections[0].rawContent} compact={false} />
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {report.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          compact={false}
          collapsible={collapsible && !!section.title}
        />
      ))}
    </div>
  )
}
