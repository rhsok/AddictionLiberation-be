import { prisma } from '../../config/db';

interface CategoryType {
  id?: number;
  name: string;
  description: string;
}

class CategoryModel {
  //카테고리 생성하는 매서드
  async createCategory(category: CategoryType): Promise<number> {
    console.log('ci', category.id);
    const existingCategory = await prisma.category.findUnique({
      where: { name: category.name },
    });
    console.log('re', existingCategory);

    if (existingCategory) {
      throw new Error('카테고리가 이미 존재합니다.');
    }
    const { name, description = '' } = category; // 기본값 제공

    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
      },
    });
    return createdCategory.id;
  }

  // 모든 카테고리를 조회하는 매서드
  async getAllCategories(): Promise<CategoryType[]> {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  // 특정 ID로 카테고리를 조회하는 매서드
  async getCategoryById(id: number): Promise<any> {
    return await prisma.postCategory.findMany({
      where: { categoryId: id },
      include: {
        post: true,
      },
    });
  }

  // 카테고리를 업데이트하는 매서드
  async updateCategory(
    id: number,
    category: CategoryType
  ): Promise<CategoryType> {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: category.name,
        description: category.description,
      },
    });
    return updatedCategory;
  }

  // 카테고리를 삭제하는 매서드
  async deleteCategory(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}

export default new CategoryModel();
