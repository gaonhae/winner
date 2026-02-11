"use client";

import { useState } from "react";
import { deletePost } from "@/lib/actions/post";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deletePost(postId);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600 dark:text-red-400">
          정말 삭제하시겠습니까?
        </span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "삭제 중..." : "삭제"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm hover:bg-foreground/5 transition-colors"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg border border-red-200 text-red-600 dark:border-red-800 dark:text-red-400 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      삭제
    </button>
  );
}
