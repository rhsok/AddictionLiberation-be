import { Router } from 'express';
import postController from '../controllers/postController';
import authenticateToken from '../middleware/authMiddleware';
import { upload } from '../../lib/imageUpload';
import { authorizeAdmin } from '../middleware/authorizeAdmin';
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
router.post('/', authenticateToken, authorizeAdmin, postController.createPost);

/**
 * @swagger
 * /api/posts/main-posts:
 *  get:
 *    summary: 각 카테고리의 isMain이 true인 게시글 목록을 가져옵니다.
 *    tags: [Post]
 *    responses:
 *      200:
 *        description: 게시글 목록이 성공적으로 반환되었습니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  postId:
 *                    type: string
 *                    description: "게시글 ID"
 *                  title:
 *                    type: string
 *                    description: "게시글 제목"
 *                  subtitle:
 *                    type: string
 *                    description: "게시글 서브 제목"
 *                  content:
 *                    type: string
 *                    description: "게시글 내용"
 *                  videoUrl:
 *                    type: string
 *                    description: "게시글에 포함된 비디오 URL"
 *                  published:
 *                    type: boolean
 *                    description: "게시글의 공개 여부"
 *                  publishedDate:
 *                    type: string
 *                    format: date-time
 *                    description: "게시글 공개 날짜"
 *                  categories:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        categoryId:
 *                          type: integer
 *                          description: "카테고리 ID"
 *                        isMain:
 *                          type: boolean
 *                          description: "해당 카테고리에서 메인 게시글 여부"
 *      400:
 *        description: 잘못된 요청 파라미터입니다.
 *      404:
 *        description: 게시글을 찾을 수 없습니다.
 *      500:
 *        description: 서버 오류
 */
router.get('/main-posts', postController.getMainPosts);

// router.get('/:id', postController.getPostById);

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
 *  patch:
 *    summary: Update a post by ID with partial data
 *    tags: [Post]
 *    security:
 *      - AccessToken : []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
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
 *              postTypeId:
 *                type: integer
 *                description: "게시글 유형의 식별자"
 *              updatedAt:
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
 *                  properties:
 *                    categoryId:
 *                      type: integer
 *                      description: "게시글 카테고리의 식별자"
 *                    isMain:
 *                      type: boolean
 *                      description: "메인 카테고리 여부 (선택사항)"
 *                    order:
 *                      type: integer
 *                      description: "카테고리 내 게시글의 순서"
 *              thumbnailURL:
 *                type: string
 *                description: "섬네일 URL"
 *    responses:
 *      200:
 *        description: Post updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: 게시글이 성공적으로 업데이트되었습니다.
 *                updatedPost:
 *                  type: object
 *                  description: 업데이트된 게시글의 데이터
 *      400:
 *        description: 잘못된 요청 파라미터입니다.
 *      404:
 *        description: 게시글을 찾을 수 없습니다.
 *      500:
 *        description: 서버 오류가 발생했습니다.
 */
router.patch('/:id', authenticateToken, postController.updatePostContent);

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

// 이미지 제공 엔드포인트
router.get('/images/:filename', postController.getImage);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: 소프트 딜리트를 사용하여 게시글을 삭제합니다.
 *     description: 게시글의 `deletedAt` 필드를 현재 시간으로 설정하여 소프트 딜리트를 수행합니다.
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 게시글의 ID
 *     responses:
 *       200:
 *         description: 게시글이 소프트 삭제되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 게시글이 소프트 삭제되었습니다.
 *       404:
 *         description: 해당 ID의 게시글을 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 해당 ID의 게시글을 찾을 수 없습니다.
 *       500:
 *         description: 게시글을 소프트 삭제하는 동안 오류가 발생했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 게시글을 소프트 삭제하는 동안 오류가 발생했습니다.
 */
router.delete('/:id', postController.softeDeletePost);

export default router;
