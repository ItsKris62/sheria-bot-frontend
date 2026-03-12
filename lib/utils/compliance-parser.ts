// ─── Types ─────────────────────────────────────────────────────────────────

export type SectionType =
  | 'summary'
  | 'requirements'
  | 'recommendations'
  | 'risk'
  | 'monitoring'
  | 'general'

export type ComplianceStatus =
  | 'compliant'
  | 'non-compliant'
  | 'partially-compliant'
  | 'warning'

export interface TextNode {
  type: 'text'
  content: string
}

export interface BoldNode {
  type: 'bold'
  content: string
}

export type InlineNode = TextNode | BoldNode

export interface ParagraphBlock {
  type: 'paragraph'
  nodes: InlineNode[]
}

export interface SubheadingBlock {
  type: 'subheading'
  text: string
}

export interface BulletListBlock {
  type: 'bullet-list'
  items: InlineNode[][]
}

export interface NumberedListBlock {
  type: 'numbered-list'
  items: InlineNode[][]
}

export interface TableBlock {
  type: 'table'
  headers: InlineNode[][]
  rows: InlineNode[][][]
}

export type ContentBlock =
  | ParagraphBlock
  | SubheadingBlock
  | BulletListBlock
  | NumberedListBlock
  | TableBlock

export interface ParsedSection {
  id: string
  title: string
  type: SectionType
  status: ComplianceStatus | null
  blocks: ContentBlock[]
}

export interface ParsedComplianceReport {
  sections: ParsedSection[]
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function detectStatus(text: string): ComplianceStatus | null {
  if (/non[- ]?compliant|does not comply|violation|breach|fail to comply|non-compliance/i.test(text))
    return 'non-compliant'
  if (/partially compliant|partial compliance|some gaps|requires attention|mostly compliant/i.test(text))
    return 'partially-compliant'
  if (/\bcompliant\b|fully complies?|meets? (?:all )?requirements?|in compliance/i.test(text))
    return 'compliant'
  if (/\bwarning\b|\bcaution\b|be aware|note:/i.test(text))
    return 'warning'
  return null
}

function detectSectionType(title: string): SectionType {
  const t = title.toLowerCase()
  if (/direct answer|summary|overview|executive|introduction|background/i.test(t)) return 'summary'
  if (/legal basis|compliance requirements?|requirement|document|documentation|mandatory|checklist|needed|prerequisite/i.test(t))
    return 'requirements'
  if (/implementation guidance|recommend|action|step|implement|remediat|next step|what to do|improve/i.test(t))
    return 'recommendations'
  if (/consequences? of non.compli|risk|finding|gap|concern|critical|issue|problem|violation|non.compli/i.test(t))
    return 'risk'
  if (/timeline|monitor|ongoing|review|audit|report|maintenance|surveillance/i.test(t))
    return 'monitoring'
  return 'general'
}

/**
 * Parse inline **bold** markers into InlineNode[].
 * Any other text is returned as TextNode.
 */
export function parseInlineNodes(text: string): InlineNode[] {
  // Split on **...**
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts
    .filter((p) => p.length > 0)
    .map((part): InlineNode => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return { type: 'bold', content: part.slice(2, -2) }
      }
      return { type: 'text', content: part }
    })
}

/** True when a pipe-delimited line is a GFM separator row: |---|:---:|---| */
function isSeparatorRow(line: string): boolean {
  const inner = line.replace(/\|/g, '').trim()
  return inner.length > 0 && /^[-:\s]+$/.test(inner) && inner.includes('-')
}

/** Parse a single GFM table row into InlineNode cells. */
function parseTableRow(line: string): InlineNode[][] {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => parseInlineNodes(cell.trim()))
}

/**
 * Convert a block of markdown text into ContentBlock[].
 * Handles:
 *  - ### level-3 subheadings
 *  - **bold-only** lines as subheadings (legacy)
 *  - GFM pipe tables (| col | col |)
 *  - Bullet lists (-, *, •)
 *  - Numbered lists (1. or 1))
 *  - Regular paragraphs
 */
function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n')
  const blocks: ContentBlock[] = []

  let paragraphLines: string[] = []
  let bulletItems: string[] = []
  let numberedItems: string[] = []
  let tableLines: string[] = []

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return
    const text = paragraphLines.join(' ').trim()
    if (text) {
      blocks.push({ type: 'paragraph', nodes: parseInlineNodes(text) })
    }
    paragraphLines = []
  }

  const flushBullets = () => {
    if (bulletItems.length === 0) return
    blocks.push({
      type: 'bullet-list',
      items: bulletItems.map((item) => parseInlineNodes(item)),
    })
    bulletItems = []
  }

  const flushNumbers = () => {
    if (numberedItems.length === 0) return
    blocks.push({
      type: 'numbered-list',
      items: numberedItems.map((item) => parseInlineNodes(item)),
    })
    numberedItems = []
  }

  const flushTable = () => {
    if (tableLines.length === 0) return
    const nonSepLines = tableLines.filter((l) => !isSeparatorRow(l))
    if (nonSepLines.length > 0) {
      const [headerLine, ...dataLines] = nonSepLines
      blocks.push({
        type: 'table',
        headers: parseTableRow(headerLine),
        rows: dataLines.map(parseTableRow),
      })
    }
    tableLines = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Empty line — flush running collections
    if (!trimmed) {
      flushParagraph()
      flushBullets()
      flushNumbers()
      flushTable()
      continue
    }

    // GFM table row: starts with |
    if (trimmed.startsWith('|')) {
      flushParagraph()
      flushBullets()
      flushNumbers()
      tableLines.push(trimmed)
      continue
    }

    // Non-table line encountered while accumulating a table — flush table first
    if (tableLines.length > 0) {
      flushTable()
    }

    // ### level-3 subheading
    if (/^###\s/.test(trimmed)) {
      flushParagraph()
      flushBullets()
      flushNumbers()
      blocks.push({ type: 'subheading', text: trimmed.replace(/^###\s+/, '').trim() })
      continue
    }

    // Bold-only subheading: a line that is entirely **text** or **text:**
    if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
      flushParagraph()
      flushBullets()
      flushNumbers()
      const text = trimmed.replace(/^\*\*/, '').replace(/\*\*:?$/, '')
      blocks.push({ type: 'subheading', text })
      continue
    }

    // Bullet list item (-, *, or •)
    if (/^[-*•]\s+/.test(trimmed)) {
      flushParagraph()
      flushNumbers()
      bulletItems.push(trimmed.replace(/^[-*•]\s+/, ''))
      continue
    }

    // Numbered list item (1. or 1))
    if (/^\d+[.)]\s+/.test(trimmed)) {
      flushParagraph()
      flushBullets()
      numberedItems.push(trimmed.replace(/^\d+[.)]\s+/, ''))
      continue
    }

    // Regular paragraph line — flush bullets/numbers but accumulate paragraph
    flushBullets()
    flushNumbers()
    paragraphLines.push(trimmed)
  }

  // Flush any remaining
  flushParagraph()
  flushBullets()
  flushNumbers()
  flushTable()

  return blocks
}

function parseSectionBlock(raw: string, index: number): ParsedSection {
  const lines = raw.trim().split('\n')
  const firstLine = lines[0].trim()

  let title = ''
  let contentLines: string[]

  // Match ## heading (level 2 only — ### is handled inside parseContentBlocks)
  if (/^## /.test(firstLine)) {
    title = firstLine.replace(/^## /, '').trim()
    contentLines = lines.slice(1)
  } else {
    contentLines = lines
  }

  const content = contentLines.join('\n')
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  return {
    id: `section-${index}-${slug || 'body'}`,
    title,
    type: detectSectionType(title),
    status: detectStatus(content),
    blocks: parseContentBlocks(content),
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Parse a markdown-style AI compliance response into a structured
 * ParsedComplianceReport that the ComplianceFeedback component can render.
 *
 * Handles:
 *  - ## section headers → ParsedSection[] (### is treated as sub-content)
 *  - GFM pipe tables (| col | col |)
 *  - ### level-3 headings within sections → SubheadingBlock
 *  - **bold** subheadings within sections
 *  - Bullet lists (-, *, •)
 *  - Numbered lists (1. or 1))
 *  - Regular paragraphs
 *  - Compliance status detection per section
 *  - Section type detection from title keywords
 */
export function parseComplianceResponse(markdown: string): ParsedComplianceReport {
  if (!markdown?.trim()) {
    return { sections: [] }
  }

  // Check whether the content contains ## level-2 section headers
  const hasHeaders = /^## /m.test(markdown)

  if (hasHeaders) {
    // Split before each ## heading only (### remains inside sections as sub-content)
    const parts = markdown
      .split(/(?=^## )/m)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    return {
      sections: parts.map((part, i) => parseSectionBlock(part, i)),
    }
  }

  // No ## headers — single general section
  return {
    sections: [
      {
        id: 'section-0-body',
        title: '',
        type: 'general',
        status: detectStatus(markdown),
        blocks: parseContentBlocks(markdown),
      },
    ],
  }
}
