import { Router } from 'express';
import postController from '../controllers/postController';
const router: Router = Router();

/**
 * @swagger
 * tag:
 *  name: Post
 *  description: The categories managing API
 */

/**
 * @swagger
 *  get:
 *    summary: Returns the list of all the Post
 *    tags: [Post]
 */

/**
 * @swagger
 * /api/posts:
 *  post:
 *    summary: 게시글 작성
 *    tags: [Posts]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - title
 *              - content
 *              - authorId
 *              - categoryId
 *            properties:
 *              title:
 *                type: string
 *                description: "게시글의 제목"
 *              subtitle:
 *                type: string
 *                description: "게시글의 부제목 (선택사항)"
 *              content:
 *                type: string
 *                description: "게시글의 내용"
 *              videoUrl:
 *                type: string
 *                description: "게시글에 포함될 비디오 URL (선택사항)"
 *              published:
 *                type: boolean
 *                description: "게시글의 공개 여부"
 *              authorId:
 *                type: string
 *                description: "게시글 작성자의 식별자"
 *              categoryId:
 *                type: integer
 *                description: "게시글 카테고리의 식별자"
 *              postTypeId:
 *                type: integer
 *                description: "게시글 유형의 식별자 (선택사항)"
 *              publishedDate:
 *                type: string
 *                format: date-time
 *                description: "게시글 공개 예정일 (선택사항)"
 *              position:
 *                type: integer
 *                description: "카테고리 내 게시글의 위치 (선택사항)"
 *    request:
 *      201:
 *        description: Post created successfully
 *      500:
 *        description: Server error
 */
router.post('/', postController.createPost);

router.get('/post/:id', postController.getPostById);
router.put('posts/:id', postController.updatePostContent);

export default router;
