'use client'

import { useMemo, useState } from 'react'
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
  type ContentBlock,
  type InlineNode,
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

// ─── Inline content renderer ───────────────────────────────────────────────

function InlineContent({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        if (node.type === 'bold') {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {node.content}
            </strong>
          )
        }
        return <span key={i}>{node.content}</span>
      })}
    </>
  )
}

// ─── Table renderer ────────────────────────────────────────────────────────

interface TableRendererProps {
  block: Extract<ContentBlock, { type: 'table' }>
  compact: boolean
}

function TableRenderer({ block, compact }: TableRendererProps) {
  return (
    <div className="my-3 w-full overflow-x-auto rounded-md border border-border/50">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50 bg-muted/40">
            {block.headers.map((cell, ci) => (
              <th
                key={ci}
                className={cn(
                  'px-3 py-2 font-semibold text-foreground whitespace-nowrap',
                  compact ? 'text-[11px]' : 'text-xs',
                )}
              >
                <InlineContent nodes={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr
              key={ri}
              className={cn(
                'border-b border-border/30 last:border-0 transition-colors',
                ri % 2 === 1 ? 'bg-muted/20' : '',
              )}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    'px-3 py-2 text-foreground/80 align-top',
                    compact ? 'text-[11px]' : 'text-xs',
                  )}
                >
                  <InlineContent nodes={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Content block renderers ───────────────────────────────────────────────

interface BlockProps {
  block: ContentBlock
  compact: boolean
}

function BlockRenderer({ block, compact }: BlockProps) {
  switch (block.type) {
    case 'subheading':
      return (
        <p
          className={cn(
            'font-semibold text-foreground mt-4 mb-2 first:mt-0 flex items-center gap-1.5',
            compact ? 'text-xs' : 'text-sm',
          )}
        >
          <span className="w-1 h-3 rounded-full bg-primary/60 inline-block shrink-0" />
          {block.text}
        </p>
      )

    case 'paragraph':
      return (
        <p
          className={cn(
            'text-foreground/80 leading-[1.7]',
            compact ? 'text-xs' : 'text-sm',
          )}
        >
          <InlineContent nodes={block.nodes} />
        </p>
      )

    case 'bullet-list':
      return (
        <ul className={cn('my-2 space-y-1.5', compact ? 'space-y-1' : '')}>
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className={cn(
                  'mt-[7px] rounded-full bg-primary shrink-0',
                  compact ? 'h-1 w-1 mt-[5px]' : 'h-1.5 w-1.5',
                )}
              />
              <span
                className={cn(
                  'text-foreground/80 leading-relaxed',
                  compact ? 'text-xs' : 'text-sm',
                )}
              >
                <InlineContent nodes={item} />
              </span>
            </li>
          ))}
        </ul>
      )

    case 'numbered-list':
      return (
        <ol className={cn('my-2 space-y-2', compact ? 'space-y-1.5' : '')}>
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className={cn(
                  'shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold leading-none',
                  compact
                    ? 'h-4 w-4 text-[10px] mt-0.5'
                    : 'h-5 w-5 text-[11px] mt-0.5',
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  'text-foreground/80 leading-relaxed',
                  compact ? 'text-xs' : 'text-sm',
                )}
              >
                <InlineContent nodes={item} />
              </span>
            </li>
          ))}
        </ol>
      )

    case 'table':
      return <TableRenderer block={block} compact={compact} />

    default:
      return null
  }
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

  const bodyBlocks = (
    <div className={cn('space-y-2', compact ? 'space-y-1.5' : '')}>
      {section.blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} compact={compact} />
      ))}
    </div>
  )

  // No title: render blocks inline, no card chrome
  if (!section.title) {
    return bodyBlocks
  }

  const { Icon } = style

  const header = (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4',
        compact ? 'py-2.5' : 'py-3',
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className={cn('shrink-0', compact ? 'h-3.5 w-3.5' : 'h-4 w-4', style.iconColor)} />
        <span
          className={cn(
            'font-semibold text-foreground truncate',
            compact ? 'text-xs' : 'text-sm',
          )}
        >
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
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
              open ? 'rotate-0' : '-rotate-90',
            )}
          />
        )}
      </div>
    </div>
  )

  const body = (
    <div
      className={cn(
        'border-t border-border/30',
        compact ? 'px-4 pb-3 pt-2.5' : 'px-4 pb-4 pt-3',
      )}
    >
      {bodyBlocks}
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
// For use inside chat bubbles: no section cards, just clean styled prose.

function ChatBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'subheading':
      return (
        <p className="text-xs font-semibold text-foreground mt-3 mb-1 first:mt-0 flex items-center gap-1.5">
          <span className="w-0.5 h-3 rounded-full bg-primary/60 inline-block shrink-0" />
          {block.text}
        </p>
      )

    case 'paragraph':
      return (
        <p className="text-sm text-foreground/85 leading-relaxed">
          <InlineContent nodes={block.nodes} />
        </p>
      )

    case 'bullet-list':
      return (
        <ul className="my-1.5 space-y-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-sm text-foreground/85 leading-relaxed">
                <InlineContent nodes={item} />
              </span>
            </li>
          ))}
        </ul>
      )

    case 'numbered-list':
      return (
        <ol className="my-1.5 space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0 flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] font-semibold mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-foreground/85 leading-relaxed">
                <InlineContent nodes={item} />
              </span>
            </li>
          ))}
        </ol>
      )

    case 'table':
      return <TableRenderer block={block} compact={true} />

    default:
      return null
  }
}

function ChatSectionRenderer({ section }: { section: ParsedSection }) {
  return (
    <div className="space-y-1.5">
      {section.title && (
        <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mt-3 first:mt-0">
          {section.title}
        </p>
      )}
      {section.blocks.map((block, i) => (
        <ChatBlockRenderer key={i} block={block} />
      ))}
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
 * and content blocks, then renders them with appropriate visual styling.
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
    // No ## headers in the content — render blocks directly without any card chrome
    return (
      <div className={cn('space-y-2', className)}>
        {report.sections[0].blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} compact={false} />
        ))}
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
