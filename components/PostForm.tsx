"use client";

import { useActionState, useEffect, useRef } from "react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUpload";

interface PostFormProps {
  action: (
    prevState: { error?: string } | undefined,
    formData: FormData
  ) => Promise<{ error?: string } | undefined>;
  initialData?: {
    title: string;
    content: string;
    imageUrl?: string | null;
    imageKey?: string | null;
  };
  submitLabel: string;
}

export default function PostForm({
  action,
  initialData,
  submitLabel,
}: PostFormProps) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const { isUploading, imageUrl, imageKey, error: uploadError, upload, reset, setInitial } =
    useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.imageUrl && initialData?.imageKey) {
      setInitial(initialData.imageUrl, initialData.imageKey);
    }
  }, [initialData?.imageUrl, initialData?.imageKey, setInitial]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 클라이언트측 유효성 검사
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("JPEG, PNG, GIF, WebP 형식만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    await upload(file);
  }

  function handleRemoveImage() {
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={initialData?.title}
          className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1.5">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          required
          maxLength={10000}
          rows={12}
          defaultValue={initialData?.content}
          className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20 resize-y"
          placeholder="내용을 입력하세요"
        />
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          이미지 (선택)
        </label>

        {imageUrl ? (
          <div className="relative rounded-lg border border-foreground/10 p-3">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-foreground/5">
              <Image
                src={imageUrl}
                alt="업로드된 이미지"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              이미지 제거
            </button>
          </div>
        ) : (
          <div
            className="rounded-lg border-2 border-dashed border-foreground/15 p-8 text-center cursor-pointer hover:border-foreground/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file) {
                const dt = new DataTransfer();
                dt.items.add(file);
                if (fileInputRef.current) {
                  fileInputRef.current.files = dt.files;
                  handleFileChange({
                    target: { files: dt.files },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }
            }}
          >
            {isUploading ? (
              <p className="text-sm text-foreground/40">업로드 중...</p>
            ) : (
              <>
                <p className="text-sm text-foreground/40">
                  클릭하거나 이미지를 드래그하여 업로드
                </p>
                <p className="text-xs text-foreground/30 mt-1">
                  JPEG, PNG, GIF, WebP · 최대 5MB
                </p>
              </>
            )}
          </div>
        )}

        {uploadError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <input type="hidden" name="imageUrl" value={imageUrl || ""} />
      <input type="hidden" name="imageKey" value={imageKey || ""} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isPending ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
