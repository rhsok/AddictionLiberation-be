import path from 'path';
import fs from 'fs';
import { prisma } from '../../config/db';
import { RequestWithUser } from '../middleware/authMiddleware';
import { rejects } from 'assert';

interface UpdatePost {
  content?: string;
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  published?: boolean;
}

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
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
        categories: {
          // 여기서 categories로 수정
          include: {
            category: true,
          },
        },
        postType: true,
      },
    });
    return updateData;
  }
}

export default new PostModel();
