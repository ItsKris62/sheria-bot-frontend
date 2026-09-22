import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthGuard, GuestGuard } from '../auth-guard'
import { useAuthStore } from '@/lib/auth-store'

const mockReplace = vi.fn()
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: mockPush,
  }),
  usePathname: () => '/startup',
}))

describe('AuthGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    })
  })

  it('renders skeleton when not initialized', () => {
    useAuthStore.setState({ isInitialized: false })
    const { container } = render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )
    expect(screen.queryByText('Protected Content')).toBeNull()
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull()
  })

  it('redirects to login when unauthenticated and initialized', () => {
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )
    expect(mockReplace).toHaveBeenCalledWith('/login?redirect=%2Fstartup')
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('renders protected children when authenticated', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      isInitialized: true,
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STARTUP',
        organizationId: 'org-1',
        emailVerified: true,
        createdAt: '2026-01-01',
      },
      accessToken: 'valid-token',
    })

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )
    expect(screen.getByText('Protected Content')).toBeDefined()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('redirects to change-password if mustChangePassword is true', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      isInitialized: true,
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STARTUP',
        organizationId: 'org-1',
        emailVerified: true,
        mustChangePassword: true,
        createdAt: '2026-01-01',
      },
      accessToken: 'valid-token',
    })

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    )
    expect(mockReplace).toHaveBeenCalledWith('/change-password')
    expect(screen.queryByText('Protected Content')).toBeNull()
  })

  it('redirects when user role is not allowed', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      isInitialized: true,
      user: {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'STARTUP',
        organizationId: 'org-1',
        emailVerified: true,
        createdAt: '2026-01-01',
      },
      accessToken: 'valid-token',
    })

    render(
      <AuthGuard allowedRoles={['ADMIN']}>
        <div>Admin Protected Content</div>
      </AuthGuard>
    )
    expect(mockReplace).toHaveBeenCalledWith('/startup')
    expect(screen.queryByText('Admin Protected Content')).toBeNull()
  })
})
