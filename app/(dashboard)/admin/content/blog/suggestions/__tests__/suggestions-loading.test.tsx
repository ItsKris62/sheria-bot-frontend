import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GenericBlogLoading from '../../loading'
import BlogSuggestionsLoading from '../loading'

describe('Blog Loading Boundaries', () => {
  it('renders generic blog loading as a container-scoped skeleton without fullscreen overlay', () => {
    const { container } = render(<GenericBlogLoading />)
    const skeletonWrapper = screen.getByTestId('generic-blog-loading')
    expect(skeletonWrapper).toBeDefined()
    // Must not have min-h-screen full viewport takeover
    expect(container.querySelector('.min-h-screen')).toBeNull()
  })

  it('renders suggestions-specific loading skeleton with table and header placeholders', () => {
    const { container } = render(<BlogSuggestionsLoading />)
    const skeleton = screen.getByTestId('suggestions-loading-skeleton')
    expect(skeleton).toBeDefined()
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
    // Must remain container-scoped
    expect(container.querySelector('.min-h-screen')).toBeNull()
  })
})
