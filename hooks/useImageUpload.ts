"use client";

import { useState, useCallback } from "react";

interface UploadState {
  isUploading: boolean;
  imageUrl: string | null;
  imageKey: string | null;
  error: string | null;
}

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    imageUrl: null,
    imageKey: null,
    error: null,
  });

  const upload = useCallback(async (file: File) => {
    setState((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      // 1단계: 서버에서 presigned URL 발급
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "업로드 URL 생성에 실패했습니다.");
      }

      const { presignedUrl, key, cdnUrl } = await response.json();

      // 2단계: S3에 직접 업로드
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      setState({
        isUploading: false,
        imageUrl: cdnUrl,
        imageKey: key,
        error: null,
      });

      return { imageUrl: cdnUrl, imageKey: key };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "업로드에 실패했습니다.";
      setState((prev) => ({ ...prev, isUploading: false, error: message }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      imageUrl: null,
      imageKey: null,
      error: null,
    });
  }, []);

  const setInitial = useCallback(
    (imageUrl: string | null, imageKey: string | null) => {
      setState({
        isUploading: false,
        imageUrl,
        imageKey,
        error: null,
      });
    },
    []
  );

  return { ...state, upload, reset, setInitial };
}
