"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="mt-2 text-sm text-foreground/60">
            새 계정을 만드세요
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {state.error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1.5"
            >
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              autoComplete="name"
              className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={100}
              autoComplete="new-password"
              className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/20"
              placeholder="8자 이상"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/60">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-foreground hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
