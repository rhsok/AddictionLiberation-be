import PostModel from '../models/Post';
import { Request, Response } from 'express';
import { PostType } from '../models/Post';

class PostController {
  /**
   * @param req Express의 Request 객체
   * @param res Express의 Response 객체
   */
  async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const postId = await PostModel.createPost(req.body as PostType);
      return res
        .status(201)
        .json({ message: '게시글이 생성되었습니다', id: postId });
    } catch (error) {
      console.error('게시글 생성 에러');
      return res
        .status(500)
        .json({ error: '게시글을 생성하는 동안 오류가 발생하였습니다.' });
    }
  }

  async getPostById(req: Request, res: Response): Promise<Response> {
    try {
      const post = await PostModel.findPostById(parseInt(req.params.id));
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
   * @param req Express의 Request 객체
   * @param res Express의 Response 객체
   */
  async updatePostContent(req: Request, res: Response): Promise<Response> {
    try {
      const updatedPost = await PostModel.updatePostContent(
        parseInt(req.params.id),
        req.body.content
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
}

export default new PostController();
