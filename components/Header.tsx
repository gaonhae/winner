"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-foreground/10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          Winner
        </Link>

        <nav className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-20 rounded-lg bg-foreground/5 animate-pulse" />
          ) : session?.user ? (
            <>
              <span className="text-sm text-foreground/60 hidden sm:inline">
                {session.user.name || session.user.email}
              </span>
              <Link
                href="/posts/new"
                className="rounded-lg bg-foreground text-background px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                글쓰기
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm hover:bg-foreground/5 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm hover:bg-foreground/5 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-foreground text-background px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
