import { describe, it, expect } from 'vitest'
import { safeExternalUrl } from './safe-url'

describe('safeExternalUrl', () => {
  it('accepts valid HTTPS and HTTP URLs', () => {
    expect(safeExternalUrl('https://www.centralbank.go.ke/circulars/123')).toBe(
      'https://www.centralbank.go.ke/circulars/123'
    )
    expect(safeExternalUrl('http://kenyalaw.org/gazette')).toBe(
      'http://kenyalaw.org/gazette'
    )
    expect(safeExternalUrl('https://bnr.rw/payments')).toBe(
      'https://bnr.rw/payments'
    )
  })

  it('rejects malicious or invalid protocols', () => {
    expect(safeExternalUrl('javascript:alert(1)')).toBeNull()
    expect(safeExternalUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
    expect(safeExternalUrl('vbscript:msgbox(1)')).toBeNull()
    expect(safeExternalUrl('file:///etc/passwd')).toBeNull()
  })

  it('handles null, undefined, empty, or malformed inputs safely', () => {
    expect(safeExternalUrl(null)).toBeNull()
    expect(safeExternalUrl(undefined)).toBeNull()
    expect(safeExternalUrl('')).toBeNull()
    expect(safeExternalUrl('   ')).toBeNull()
    expect(safeExternalUrl('not-a-url')).toBeNull()
  })
})
