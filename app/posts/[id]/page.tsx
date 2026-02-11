import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getPostById } from "@/lib/queries/post";
import DeletePostButton from "@/components/DeletePostButton";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([getPostById(id), auth()]);

  if (!post) {
    notFound();
  }

  const isAuthor = session?.user?.id === post.authorId;
  const dateStr = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          &larr; 목록으로
        </Link>
      </div>

      <h1 className="text-2xl font-bold">{post.title}</h1>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <span>{post.author.name || "익명"}</span>
          <span>·</span>
          <time>{dateStr}</time>
        </div>

        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link
              href={`/posts/${post.id}/edit`}
              className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm hover:bg-foreground/5 transition-colors"
            >
              수정
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        )}
      </div>

      <hr className="my-6 border-foreground/10" />

      {post.imageUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-foreground/5">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
          {post.content}
        </p>
      </div>
    </article>
  );
}
