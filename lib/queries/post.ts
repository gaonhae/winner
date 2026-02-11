import { prisma } from "@/lib/prisma";

const POSTS_PER_PAGE = 10;

export async function getPosts(page: number = 1) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: POSTS_PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    }),
    prisma.post.count(),
  ]);

  return {
    posts,
    totalPages: Math.ceil(totalCount / POSTS_PER_PAGE),
    currentPage: page,
  };
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, image: true, email: true },
      },
    },
  });
}
