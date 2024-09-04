import { prisma } from '../../config/db';

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
  authorId: string;
  subtitle: string;
  videoUrl: string;
  published: boolean;
  postTypeId: number;
  publishedDate: Date;
  order: number;
  categories: CategoryInput[];
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

class PostModel {
  /**
   * @prisma post 게시글 데이터
   * @returns 생성된 게시글의 Id
   */

  async createPost(postData: CreatePostInput): Promise<any> {
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

    console.log('categoryOrder', categoryOrders);

    return prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        authorId: postData.authorId,
        subtitle: postData.subtitle,
        videoUrl: postData.videoUrl,
        published: postData.published ?? false,
        postTypeId: postData.postTypeId,
        publishedDate: postData.publishedDate || new Date(),
        order: postData.order || 0,
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

  /**
   * @param id 게시글 ID
   * @returns 게시글 데이터 또는 null
   */
  async findPostById(postId: string): Promise<any> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        categories: {
          // `categories`는 `Post`와 `Category`를 연결하는 중개 테이블을 통해 접근
          include: {
            category: true, // 중개 테이블 내에서 실제 카테고리 정보를 포함
          },
        },
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
