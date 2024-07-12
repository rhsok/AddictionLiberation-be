import { Router } from 'express';
// 사용자 컨트롤러를 임포트합니다.
import userController from '../controllers/userController';
// 새로운 Router 객체를 생성합니다.
const router: Router = Router();
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
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

export default router;
