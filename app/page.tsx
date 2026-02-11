import { getPosts } from "@/lib/queries/post";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages, currentPage } = await getPosts(page);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">게시판</h1>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-foreground/40">
          <p className="text-lg">아직 게시글이 없습니다.</p>
          <p className="text-sm mt-1">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              imageUrl={post.imageUrl}
              authorName={post.author.name}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
