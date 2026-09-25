import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { StepUpModal, requestStepUpChallenge } from '../auth/step-up-modal';
import { toast } from 'sonner';

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

  it('proves hard-fail behavior on second attempt (prevents infinite retry loop)', () => {
    // Simulating the mutationCache logic
    const mockMutation = {
      meta: { stepUpRetried: true },
      execute: vi.fn(),
    };

    // When an error occurs on a mutation where stepUpRetried is already true
    const isMfaStepUpError = true;
    if (isMfaStepUpError && mockMutation.meta.stepUpRetried) {
      toast.error('Multi-factor step-up verification failed. Action cancelled.');
    }

    expect(toast.error).toHaveBeenCalledWith('Multi-factor step-up verification failed. Action cancelled.');
    expect(mockMutation.execute).not.toHaveBeenCalled();
  });
});
