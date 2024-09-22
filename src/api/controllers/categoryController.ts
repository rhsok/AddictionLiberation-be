import { Request, Response } from 'express';
import CategoryModel from '../models/Category';

// 카테고리 관련 작업을 다루는 컨트롤러 클래스
class CategoryController {
  // 모든 카테고리를 가져오는 메서드
  async getAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await CategoryModel.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ID로 카테고리를 가져오는 메서드
  async getCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id, 10);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invaild category Id' });
      }
      const category = await CategoryModel.getCategoryById(categoryId);
      if (category) {
        return res.status(200).json(category);
      } else {
        return res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // 새로운 카테고리를 생성하는 메서드
  async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;
      const newCategoryId = await CategoryModel.createCategory({
        name,
        description,
      });
      return res.status(201).json({ id: newCategoryId });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }
  // 카테고리를 업데이트하는 메서드
  async updateCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const categoryId = parseInt(id, 10);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invaild category ID' });
      }
      const updatedCategory = await CategoryModel.updateCategory(categoryId, {
        name,
        description,
      });
      return res.status(200).json(updatedCategory);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  // 카테고리를 삭제하는 메서드
  async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id, 10);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invaild category Id' });
      }
      await CategoryModel.deleteCategory(categoryId);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }
}

export default new CategoryController();
