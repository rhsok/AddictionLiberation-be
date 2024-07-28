import { Router } from 'express';
// 사용자 컨트롤러를 임포트합니다.
import userController from '../controllers/userController';
// 새로운 Router 객체를 생성합니다.
const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secure123!
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created
 *       500:
 *         description: Error registering user
 */

// '/register' 경로에 POST 요청이 들어올 경우 userController의 registerUser 메서드를 호출
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secure123!
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful, token returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in user
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /refresh_token:
 *   post:
 *     summary: Refresh the access token using a refresh token
 *     tags: [Users]
 *     description: >
 *       This endpoint refreshes the user's access token by verifying the refresh token sent in a cookie.
 *       It returns a new access token and optionally updates the refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 description: The ID of the user for whom the token is to be refreshed.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The newly issued access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized, invalid or expired refresh token.
 *       500:
 *         description: Internal server error.
 */

router.post('/refresh_token', userController.setRefreshToken);

export default router;
