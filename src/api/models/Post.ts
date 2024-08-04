import { prisma } from '../../config/db';

export interface PostType {
  title: string;
  subtitle?: string;
  content: string;
  videoUrl?: string;
  published?: boolean;
  authorId: string;
  categoryId: number;
  postTypeId?: number;
  publishedDate?: Date;
  position: number;
}

interface UpdatePost {
  content?: string;
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  published?: boolean;
}

class PostModel {
  /**
   * @prisma post 게시글 데이터
   * @returns 생성된 게시글의 Id
   */
  async createPost(post: PostType): Promise<string> {
    const existingPosts = await prisma.post.findMany({
      where: { categoryId: post.categoryId },
      orderBy: { position: 'desc' },
      take: 1,
    });

    const newPosition =
      existingPosts.length > 0 ? existingPosts[0].position + 1 : 1;

    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        subtitle: post.subtitle ?? '',
        content: post.content,
        videoUrl: post.videoUrl ?? '',
        published: post.published ?? false,
        authorId: post.authorId,
        categoryId: post.categoryId,
        postTypeId: post.postTypeId,
        position: newPosition,
        publishedDate: post.publishedDate ?? '',
      },
    });
    return createdPost.id;
  }

  /**
   * @param id 게시글 ID
   * @returns 게시글 데이터 또는 null
   */
  async findPostById(postId: string): Promise<any> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        category: true,
        postType: true,
      },
    });
    return post;
  }

  /**
   * @param id 게시글 ID
   * @param content 새로운 콘텐츠
   * @returns 업데이트된 게시글
   */
  async updatePostContent(
    postId: string,
    updateData: UpdatePost
  ): Promise<any> {
    return await prisma.post.update({
      where: { id: postId },
      data: {
        content: updateData.content ?? '',
        title: updateData.title,
        subtitle: updateData.subtitle,
        videoUrl: updateData.videoUrl,
        published: updateData.published ?? false,
      },
      include: {
        author: true,
        category: true,
        postType: true,
      },
    });
    return updateData;
  }
}

export default new PostModel();
