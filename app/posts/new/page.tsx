import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PostForm from "@/components/PostForm";
import { createPost } from "@/lib/actions/post";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>
      <PostForm action={createPost} submitLabel="게시하기" />
    </div>
  );
}
