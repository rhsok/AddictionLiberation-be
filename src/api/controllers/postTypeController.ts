import { Request, Response } from 'express';
import PostTypeModel from '../models/PostType';

class PostTypeController {
  async createPostType(req: Request, res: Response): Promise<Response> {
    try {
      const postType = await PostTypeModel.createPostType(req.body);
      return res.status(201).json(postType);
    } catch (error) {
      console.error('Error creating post type:', error);
      return res.status(500).json({ message: 'Error creating post type' });
    }
  }

  async getPostTypes(req: Request, res: Response): Promise<Response> {
    try {
      const postTypes = await PostTypeModel.getAllPostTypes();
      return res.status(200).json(postTypes);
    } catch (error) {
      console.error('Error fetching post types:', error);
      return res.status(500).json({ message: 'Error fetching post types' });
    }
  }

  async getPostType(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);
    try {
      const postType = await PostTypeModel.getPostTypeById(id);
      if (postType) {
        return res.status(200).json(postType);
      } else {
        return res.status(404).json({ message: 'Post type not found' });
      }
    } catch (error) {
      console.error('Error fetching post type:', error);
      return res.status(500).json({ message: 'Error fetching post type' });
    }
  }

  async updatePostType(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);
    try {
      const postType = await PostTypeModel.updatePostType(id, req.body);
      return res.status(200).json(postType);
    } catch (error) {
      console.error('Error updating post type:', error);
      return res.status(500).json({ message: 'Error updating post type' });
    }
  }

  async deletePostType(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);
    try {
      await PostTypeModel.deletePostType(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting post type:', error);
      return res.status(500).json({ message: 'Error deleting post type' });
    }
  }
}

export default new PostTypeController();
