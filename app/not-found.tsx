import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mt-2 text-sm text-foreground/60">
        요청하신 페이지가 존재하지 않습니다.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
