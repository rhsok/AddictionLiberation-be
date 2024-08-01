import { prisma } from '../../config/db';

export interface PostType {
  id?: number;
  title: string;
  content: string;
  position: number;
  publishedDate: Date;
  author: string;
  categoryId: number;
  typeId: number;
}

class PostModel {
  /**
   * @prisma post 게시글 데이터
   * @returns 생성된 게시글의 Id
   */
  async createPost(post: PostType): Promise<number> {
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
        content: post.content,
        position: newPosition,
        publishedDate: post.publishedDate,
        author: post.author,
        categoryId: post.categoryId,
        typeId: post.typeId,
      },
    });
    return createdPost.id;
  }

  /**
   * @param id 게시글 ID
   * @returns 게시글 데이터 또는 null
   */
  async findPostById(id: number): Promise<PostType | null> {
    return await prisma.post.findUnique({
      where: { id },
    });
  }

  /**
   * @param id 게시글 ID
   * @param content 새로운 콘텐츠
   * @returns 업데이트된 게시글
   */
  async updatePostContent(id: number, content: string): Promise<PostType> {
    return await prisma.post.update({
      where: { id },
      data: { content },
    });
  }
}

export default new PostModel();
