import path from 'path';
import { prisma } from '../../config/db';
import { RequestWithUser } from '../middleware/authMiddleware';

type UpdatePost = {
  title?: string;
  subtitle?: string;
  content?: string;
  videoUrl?: string;
  published?: boolean;
  postTypeId?: number;
  publishedDate?: Date;
  order?: number;
  viewCount: number;
  thumbnailImageURL?: string;
  categories?: { categoryId: number; isMain: boolean; order: number }[];
};

export interface CategoryInput {
  categoryId: number; // 이 속성을 추가
  isMain?: boolean;
}

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string | undefined;
  subtitle: string;
  videoUrl: string;
  published: boolean;
  postTypeId: number;
  publishedDate: Date;
  order: number;
  categories: CategoryInput[];
  thumbnailImageURL: string;
}

export interface CategoryOrder {
  categoryId: number;
  order: number;
  isMain: boolean;
}

export interface PostType {
  title: string;
  content: string;
  authorId: string;
  categories: CategoryInput[];
}

interface File {
  path: string;
  originalname: string;
}

const uploadDirectory = path.join(__dirname, '../uploads');

class PostModel {
  /**
   * @prisma post 게시글 데이터
   * @returns 생성된 게시글의 Id
   */

  async createPost(
    req: RequestWithUser,
    postData: CreatePostInput
  ): Promise<any> {
    console.log('0', postData);
    const categoryOrders: CategoryOrder[] = await Promise.all(
      postData.categories.map(async (category) => {
        const count = await prisma.postCategory.count({
          where: { categoryId: category.categoryId },
        });
        return {
          categoryId: category.categoryId,
          order: count + 1,
          isMain: category.isMain || false,
        };
      })
    );

    const authorId = req.user?.id;

    return prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        authorId: authorId || '',
        subtitle: postData.subtitle,
        videoUrl: postData.videoUrl,
        published: postData.published ?? false,
        postTypeId: postData.postTypeId,
        publishedDate: postData.publishedDate || new Date(),
        order: postData.order || 0,
        thumbnailImageURL: postData.thumbnailImageURL,
        categories: {
          create: categoryOrders,
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  /**이미지 업로드 */
  async saveImage(file: File): Promise<string> {
    const fileName = file.path.split('/').slice(-1);
    const fileUrl = `http://localhost:8000/api/posts/images/${fileName}`;
    return Promise.resolve(fileUrl); // 파일 경로를 반환
  }

  // 특정 카테고리의 isMain이 true인 게시글 가져오기
  async getMainPostsByCategories(
    categoryIds: number[]
  ): Promise<{ [key: number]: any[] }> {
    const results = await Promise.all(
      categoryIds.map(async (categoryId) => {
        const posts = await prisma.postCategory.findMany({
          where: {
            categoryId: categoryId,
            isMain: true,
          },
          take: 3, // 게시글 4개 가져오기
          include: {
            post: true,
          },
        });

        // 카테고리 ID를 키로 사용하여 결과 객체를 반환
        return { [categoryId]: posts.map((item: any) => item.post) };
      })
    );

    // 배열을 객체로 변환
    return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }

  /**
   * @param id 게시글 ID
   * @returns 게시글 데이터 또는 null
   */
  async findPostById(postId: string): Promise<any> {
    const post = await prisma.post.update({
      where: { id: postId, deletedAt: null },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        categories: {
          select: {
            category: true,
            isMain: true,
            order: true,
          },
        },
      },
    });
    return post;
  }

  /**
   * @param id 게시글 ID
   * @param content 새로운 콘텐츠
   * @returns 업데이트된 게시글
   */
  async updatePostHandler(
    postId: string,
    updateData: UpdatePost
  ): Promise<any> {
    console.log('postId:', postId);
    console.log('updateData:', updateData);

    const publishedDate = updateData.publishedDate
      ? updateData.publishedDate
      : (
          await prisma.post.findUnique({
            where: { id: postId },
          })
        )?.publishedDate;

    return await prisma.post.update({
      where: { id: postId },
      data: {
        title: updateData.title,
        subtitle: updateData.subtitle,
        content: updateData.content,
        videoUrl: updateData.videoUrl,
        published: updateData.published,
        publishedDate,
        order: updateData.order,
        thumbnailImageURL: updateData.thumbnailImageURL,
        postTypeId: updateData.postTypeId,
        categories: updateData.categories
          ? {
              deleteMany: {}, // 기존 연결을 삭제
              create: updateData.categories.map((category) => ({
                categoryId: category.categoryId,
                isMain: category.isMain,
                order: category.order,
              })),
            }
          : undefined,
        updatedAt: new Date(),
      },

      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    return updateData;
  }

  async deletePostById(postId: string): Promise<boolean> {
    const a = await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });
    console.log('1', a);
    return true;
  }
}

export default new PostModel();
