"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const postSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(200, "제목은 200자 이내로 입력해주세요."),
  content: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .max(10000, "내용은 10,000자 이내로 입력해주세요."),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
});

export async function createPost(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "로그인이 필요합니다." };
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl") || undefined,
    imageKey: formData.get("imageKey") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl || null,
      imageKey: parsed.data.imageKey || null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  redirect(`/posts/${post.id}`);
}

export async function updatePost(
  postId: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "로그인이 필요합니다." };
  }

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (!existingPost || existingPost.authorId !== session.user.id) {
    return { error: "게시글을 찾을 수 없거나 수정 권한이 없습니다." };
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl") || undefined,
    imageKey: formData.get("imageKey") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // 이미지가 변경되었으면 기존 이미지 S3에서 삭제
  if (
    existingPost.imageKey &&
    existingPost.imageKey !== (parsed.data.imageKey || null)
  ) {
    const { deleteS3Object } = await import("@/lib/s3");
    await deleteS3Object(existingPost.imageKey);
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl || null,
      imageKey: parsed.data.imageKey || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "로그인이 필요합니다." };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id) {
    return { error: "게시글을 찾을 수 없거나 삭제 권한이 없습니다." };
  }

  // S3에서 이미지 삭제
  if (post.imageKey) {
    const { deleteS3Object } = await import("@/lib/s3");
    await deleteS3Object(post.imageKey);
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  redirect("/");
}
