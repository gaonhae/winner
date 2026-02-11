import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPostById } from "@/lib/queries/post";
import { updatePost } from "@/lib/actions/post";
import PostForm from "@/components/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, post] = await Promise.all([auth(), getPostById(id)]);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!post) {
    notFound();
  }

  if (post.authorId !== session.user.id) {
    redirect("/");
  }

  const boundUpdatePost = updatePost.bind(null, post.id);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>
      <PostForm
        action={boundUpdatePost}
        initialData={{
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          imageKey: post.imageKey,
        }}
        submitLabel="수정하기"
      />
    </div>
  );
}
