import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const pageSource = readFileSync(
  join(process.cwd(), 'app', '(dashboard)', 'startup', 'gap-analysis', 'page.tsx'),
  'utf8',
)

describe('Gap Analysis depth product copy', () => {
  it('renders backend-authoritative depth options and commercial units', () => {
    expect(pageSource).toContain('gapLimits?.depthOptions')
    expect(pageSource).toContain('d.units')
    expect(pageSource).not.toContain('const ANALYSIS_DEPTHS =')
  })

  it('contains no unsupported precise duration or exhaustive-audit claim', () => {
    expect(pageSource).not.toMatch(/~30 seconds|~60 seconds|~90 seconds|up to 3 minutes|1-3 minutes/)
    expect(pageSource).not.toMatch(/100% exhaustive|complete legal audit|guaranteed compliance/i)
  })
})
