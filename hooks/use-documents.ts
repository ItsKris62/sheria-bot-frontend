"use client";

import { useCallback } from "react";
import { trpc, getErrorMessage } from "@/lib/trpc";

/** Hook for document list with pagination */
export function useDocuments(options?: {
  page?: number;
  limit?: number;
  documentType?: string;
  search?: string;
}) {
  return trpc.document.list.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 10,
    documentType: options?.documentType,
    search: options?.search,
  });
}

/** Hook for a single document */
export function useDocument(id: string) {
  return trpc.document.get.useQuery(
    { id },
    { enabled: !!id },
  );
}

/** Hook for document upload + management operations */
export function useDocumentActions() {
  const utils = trpc.useUtils();

  const getUploadUrlMutation = trpc.document.getUploadUrl.useMutation();
  const confirmUploadMutation = trpc.document.confirmUpload.useMutation({
    onSuccess: () => {
      utils.document.list.invalidate();
    },
  });
  const getDownloadUrlMutation = trpc.document.getDownloadUrl.useMutation();
  const deleteMutation = trpc.document.delete.useMutation({
    onSuccess: () => {
      utils.document.list.invalidate();
    },
  });

  /** Full upload flow: get presigned URL → upload file → confirm */
  const uploadDocument = useCallback(
    async (file: File, documentType: string, description?: string) => {
      // Step 1: Get presigned upload URL
      const { uploadUrl, key } = await getUploadUrlMutation.mutateAsync({
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        documentType,
      });

      // Step 2: Upload file directly to R2
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // Step 3: Confirm upload with backend
      const result = await confirmUploadMutation.mutateAsync({
        key,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        documentType,
        description,
      });

      return result;
    },
    [getUploadUrlMutation, confirmUploadMutation],
  );

  return {
    uploadDocument,
    isUploading: getUploadUrlMutation.isPending || confirmUploadMutation.isPending,
    uploadError: getUploadUrlMutation.error
      ? getErrorMessage(getUploadUrlMutation.error)
      : confirmUploadMutation.error
        ? getErrorMessage(confirmUploadMutation.error)
        : null,

    /** Get download URL for a document */
    getDownloadUrl: getDownloadUrlMutation.mutateAsync,

    /** Delete a document */
    remove: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
