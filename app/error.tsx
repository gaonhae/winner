"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-semibold">문제가 발생했습니다</h2>
      <p className="mt-2 text-sm text-foreground/60">
        예상치 못한 오류가 발생했습니다. 다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        다시 시도
      </button>
    </div>
  );
}
