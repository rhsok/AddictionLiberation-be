import { Router } from 'express';
import postController from '../controllers/postController';
import authenticateToken from '../middleware/authMiddleware';
import { upload } from '../../lib/imageUpload';
const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The posts managing API
 */

/**
 * @swagger
 * /api/posts:
 *  post:
 *    summary: 게시글 작성
 *    tags: [Post]
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
 *              - categories
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
 *              postTypeId:
 *                type: integer
 *                description: "게시글 유형의 식별자"
 *              publishedDate:
 *                type: string
 *                format: date-time
 *                description: "게시글 공개 예정일 (선택사항)"
 *              order:
 *                type: integer
 *                description: "카테고리 내 게시글의 위치 (선택사항)"
 *              categories:
 *                type: array
 *                items:
 *                  type: object
 *                  required:
 *                    - categoryId
 *                  properties:
 *                    categoryId:
 *                      type: integer
 *                      description: "게시글 카테고리의 식별자"
 *                    isMain:
 *                      type: boolean
 *                      description: "메인 카테고리 여부 (선택사항)"
 *    responses:
 *      201:
 *        description: Post created successfully
 *      500:
 *        description: Server error
 */
router.post('/', authenticateToken, postController.createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *  get:
 *    summary: Returns a specific post by Id
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The post id
 *    responses:
 *      200:
 *        description: Post found and returned
 *      404:
 *        description: Post not found
 */
router.get('/:id', postController.getPostById);

/**
 * @swagger
 * /api/posts/{id}:
 *  put:
 *    summary: Update a post's content by ID
 *    tags: [Post]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *              title:
 *                type: string
 *              subtitle:
 *                type: string
 *              videoUrl:
 *                type: string
 *              published:
 *                type: boolean
 *    responses:
 *      200:
 *        description: Post updated successfully
 *      404:
 *        description: Post not found
 *      500:
 *        description: Server error
 */
router.put('/:id', postController.updatePostContent);

/**
 * @swagger
 * /api/posts/upload:
 *   post:
 *     summary: 이미지 업로드
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 이미지 파일
 *     responses:
 *       200:
 *         description: 파일이 성공적으로 업로드되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 filePath:
 *                   type: string
 *                   example: /uploads/your_image.jpg
 *       400:
 *         description: 파일이 업로드되지 않았습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 *       500:
 *         description: 파일 업로드 중 오류가 발생했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error uploading file
 *                 error:
 *                   type: object
 *                   description: 오류에 대한 추가 정보
 */
router.post('/upload', upload.single('file'), postController.uploadImage);

export default router;
