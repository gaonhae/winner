import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  authorName: string | null;
  createdAt: Date;
}

export default function PostCard({
  id,
  title,
  content,
  imageUrl,
  authorName,
  createdAt,
}: PostCardProps) {
  const excerpt =
    content.length > 100 ? content.slice(0, 100) + "..." : content;
  const dateStr = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/posts/${id}`}
      className="block rounded-xl border border-foreground/10 p-4 hover:border-foreground/20 hover:shadow-sm transition-all"
    >
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <p className="mt-1 text-sm text-foreground/60 line-clamp-2">
            {excerpt}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-foreground/40">
            <span>{authorName || "익명"}</span>
            <span>·</span>
            <span>{dateStr}</span>
          </div>
        </div>
        {imageUrl && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-foreground/5">
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
      </div>
    </Link>
  );
}
