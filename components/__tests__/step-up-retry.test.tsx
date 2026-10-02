import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { StepUpModal, requestStepUpChallenge } from '../auth/step-up-modal';
import { makeQueryClient } from '../providers';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'sonner';

vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock tRPC client
const mockMutateAsync = vi.fn();
vi.mock('@/lib/trpc', () => ({
  getErrorMessage: (err: any) => err?.message || 'Error occurred',
  trpc: {
    user: {
      verifyStepUp: {
        useMutation: () => ({
          mutateAsync: mockMutateAsync,
          isPending: false,
        }),
      },
    },
  },
}));

describe('Frontend Step-Up MFA Challenge & Mutation Retry Flow (Blocker 1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step-up challenge modal when requested and retries original mutation on verification success', async () => {
    const onSuccess = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();

    render(<StepUpModal />);

    // Initially modal is closed
    expect(screen.queryByText('Step-Up Authentication Required')).toBeNull();

    // Trigger step-up challenge (as done by mutationCache onError)
    await act(async () => {
      requestStepUpChallenge({ onSuccess, onCancel });
    });

    // Modal should now be open
    expect(await screen.findByText('Step-Up Authentication Required')).toBeDefined();

    // Enter 6-digit TOTP code
    const input = screen.getByPlaceholderText('000000');
    await act(async () => {
      fireEvent.change(input, { target: { value: '123456' } });
    });

    // Mock successful step-up verification
    mockMutateAsync.mockResolvedValueOnce({ success: true });

    // Click verify
    const verifyButton = screen.getByRole('button', { name: /Verify & Proceed/i });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ code: '123456' });
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    // Modal should close after success
    await waitFor(() => {
      expect(screen.queryByText('Step-Up Authentication Required')).toBeNull();
    });
  });

  it('calls onCancel when the cancel button is clicked and does not retry mutation', async () => {
    const onSuccess = vi.fn();
    const onCancel = vi.fn();

    render(<StepUpModal />);

    await act(async () => {
      requestStepUpChallenge({ onSuccess, onCancel });
    });

    expect(await screen.findByText('Step-Up Authentication Required')).toBeDefined();

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('shows error inside modal when verification code is invalid and allows user to re-enter', async () => {
    const onSuccess = vi.fn();
    const onCancel = vi.fn();

    render(<StepUpModal />);

    await act(async () => {
      requestStepUpChallenge({ onSuccess, onCancel });
    });

    const input = await screen.findByPlaceholderText('000000');
    await act(async () => {
      fireEvent.change(input, { target: { value: '000000' } });
    });

    // Mock backend rejection for invalid TOTP code
    mockMutateAsync.mockRejectedValueOnce(new Error('Invalid MFA verification code.'));

    const verifyButton = screen.getByRole('button', { name: /Verify & Proceed/i });
    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid MFA verification code.')).toBeDefined();
    });

    // Mutation is not retried until valid code is provided
    expect(onSuccess).not.toHaveBeenCalled();
  });

function createTRPCError(message: string, code: string) {
  return new TRPCClientError(message, {
    result: {
      error: {
        message,
        data: { code },
      },
    },
  });
}

  it('proves hard-fail behavior on second attempt and prevents infinite retry loop without duplicate toasts', async () => {
    const queryClient = makeQueryClient();
    const mutationCache = queryClient.getMutationCache();
    const onErrorHandler = (mutationCache as any).config.onError;
    expect(onErrorHandler).toBeDefined();

    // Create a mock mutation that returns MFA_STEP_UP_REQUIRED
    const mfaError = createTRPCError('MFA_STEP_UP_REQUIRED', 'PRECONDITION_FAILED');

    let retryCalled = false;
    const mockMutation = {
      options: {},
      execute: vi.fn().mockImplementation(async () => {
        retryCalled = true;
        // In TanStack Query, mutation execution failure notifies the mutation cache onError handler
        onErrorHandler(mfaError, { someVar: 'val' }, {}, mockMutation);
        throw mfaError;
      }),
    } as any;

    render(<StepUpModal />);

    // Trigger onError for the first time
    await act(async () => {
      onErrorHandler(mfaError, { someVar: 'val' }, {}, mockMutation);
    });

    // Modal should be open
    expect(await screen.findByText('Step-Up Authentication Required')).toBeDefined();

    // Mock verification mutation success
    mockMutateAsync.mockResolvedValueOnce({ success: true });

    // Enter code and proceed
    const input = screen.getByPlaceholderText('000000');
    await act(async () => {
      fireEvent.change(input, { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Proceed/i }));
    });

    await waitFor(() => {
      expect(retryCalled).toBe(true);
      expect(mockMutation.execute).toHaveBeenCalledTimes(1);
    });

    // Should toast the specific step-up verification failure message
    expect(toast.error).toHaveBeenCalledWith('Multi-factor step-up verification failed. Action cancelled.');
    // Exactly one toast should be fired — duplicate generic error toast was prevented
    expect(toast.error).toHaveBeenCalledTimes(1);
    // Should NOT have opened another challenge
    expect(screen.queryByText('Step-Up Authentication Required')).toBeNull();
  });

  it('resets retry guard after mutation execution completes so future mutations can challenge', async () => {
    const queryClient = makeQueryClient();
    const mutationCache = queryClient.getMutationCache();
    const onErrorHandler = (mutationCache as any).config.onError;

    const mfaError = createTRPCError('MFA_STEP_UP_REQUIRED', 'PRECONDITION_FAILED');

    const mockMutation = {
      options: {},
      execute: vi.fn().mockResolvedValue({ success: true }),
    } as any;

    render(<StepUpModal />);

    // First challenge
    await act(async () => {
      onErrorHandler(mfaError, {}, {}, mockMutation);
    });
    expect(await screen.findByText('Step-Up Authentication Required')).toBeDefined();

    mockMutateAsync.mockResolvedValueOnce({ success: true });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button', { name: /Verify & Proceed/i }));
    });

    await waitFor(() => {
      expect(mockMutation.execute).toHaveBeenCalledTimes(1);
    });

    // Guard should be reset, so another MFA error on this mutation can trigger a challenge again
    await act(async () => {
      onErrorHandler(mfaError, {}, {}, mockMutation);
    });
    expect(await screen.findByText('Step-Up Authentication Required')).toBeDefined();
  });

  it('passes unrelated mutation errors through to normal error handling', async () => {
    const queryClient = makeQueryClient();
    const mutationCache = queryClient.getMutationCache();
    const onErrorHandler = (mutationCache as any).config.onError;

    const generalError = createTRPCError('Internal server error occurred.', 'INTERNAL_SERVER_ERROR');

    const mockMutation = {
      options: {},
      execute: vi.fn(),
    } as any;

    await act(async () => {
      onErrorHandler(generalError, {}, {}, mockMutation);
    });

    expect(toast.error).toHaveBeenCalledWith('Internal server error occurred.');
    expect(mockMutation.execute).not.toHaveBeenCalled();
  });
});
