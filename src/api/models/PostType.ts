import { prisma } from '../../config/db';

export interface PostTypeInput {
  name: string;
  description: string;
  order: number;
}

class PostTypeModel {
  async createPostType(data: PostTypeInput) {
    return await prisma.postType.create({ data });
  }

  async getAllPostTypes() {
    return await prisma.postType.findMany();
  }

  async getPostTypeById(id: number) {
    return await prisma.postType.findUnique({
      where: { id },
    });
  }

  async updatePostType(id: number, data: PostTypeInput) {
    return await prisma.postType.update({
      where: { id },
      data,
    });
  }

  async deletePostType(id: number) {
    return await prisma.postType.delete({
      where: { id },
    });
  }
}

export default new PostTypeModel();
