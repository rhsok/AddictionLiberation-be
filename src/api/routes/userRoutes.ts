import { Router } from 'express';
// 사용자 컨트롤러를 임포트합니다.
import userController from '../controllers/userController';
// 새로운 Router 객체를 생성합니다.
const router: Router = Router();
// '/register' 경로에 POST 요청이 들어올 경우 userController의 registerUser 메서드를 호출
router.post('register', userController.registerUser);

export default router;
