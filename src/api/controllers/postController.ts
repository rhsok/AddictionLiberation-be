import PostModel, { CreatePostInput } from '../models/Post';
import { Request, Response } from 'express';
import { PostType } from '../models/Post';
import path from 'path';

class PostController {
  /**
   * @param req Express의 Request 객체
   * @param res Express의 Response 객체
   */
  async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const postId = await PostModel.createPost(
        req,
        req.body as CreatePostInput
      );
      return res
        .status(201)
        .json({ message: '게시글이 생성되었습니다', id: postId });
    } catch (error) {
      console.error('게시글 생성 에러', error);
      return res
        .status(500)
        .json({ error: '게시글을 생성하는 동안 오류가 발생하였습니다.' });
    }
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const filePath = await PostModel.saveImage(req.file);
      res.status(200).json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading file', error });
    }
  }

  async getImage(req: Request, res: Response) {
    console.log('이미지가져오기시작', req.params.filename);
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../../../../uploads', filename);

    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).send('이미지를 찾을 수 없습니다.');
      }
    });
  }

  async getMainPosts(req: Request, res: Response) {
    const categoryIds = [1, 2, 3, 4]; // 카테고리 ID 배열
    try {
      const mainPosts = await PostModel.getMainPostsByCategories(categoryIds);
      res.json(mainPosts);
    } catch (error) {
      res.status(500).json({ error: '게시글 조회 실패' });
    }
  }

  async getPostById(req: Request, res: Response): Promise<Response> {
    try {
      const post = await PostModel.findPostById(req.params.id);
      if (post) {
        return res.status(200).json(post);
      } else {
        return res
          .status(404)
          .json({ message: '해당 ID의 게시글을 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('게시글 조회 에러:', error);
      return res
        .status(500)
        .json({ error: '게시글을 조회하는 동안 오류가 발생했습니다.' });
    }
  }

  /**
   * 게시글 내용 업데이트
   */
  async updatePostContent(req: Request, res: Response): Promise<Response> {
    try {
      const updatedPost = await PostModel.updatePostHandler(
        req.params.id,
        req.body
      );
      return res
        .status(200)
        .json({ message: '게시글이 업데이트되었습니다.', updatedPost });
    } catch (error) {
      console.error('게시글 업데이트 에러:', error);
      return res
        .status(500)
        .json({ error: '게시글을 업데이트하는 동안 오류가 발생했습니다.' });
    }
  }

  async softeDeletePost(req: Request, res: Response): Promise<Response> {
    console.log('req', req.params.id);
    try {
      const postId = req.params.id;
      const success = await PostModel.deletePostById(postId);
      if (success) {
        return res.status(200).json({ message: '게시글이 삭제되었습니다.' });
      } else {
        return res
          .status(404)
          .json({ message: '해당 ID의 게시글을 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error('게시글 삭제 에러:', error);
      return res
        .status(500)
        .json({ error: '게시글을 삭제하는 동안 오류가 발생했습니다.' });
    }
  }
}

export default new PostController();
