// 'express' 라이브러리에서 'Router', 'Request', 'Response' 타입을 임포트합니다.
// 이들은 Express 앱에서 라우팅과 HTTP 요청/응답 처리를 위해 필요합니다.
import { Router, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './userRoutes';
import categoryRoutes from './categoryRoutes';
import postRoutes from './postRoutes';

// 새로운 Router 객체를 생성합니다. 이 라우터는 API 엔드포인트의 경로를 정의하고,
// 해당 경로에 대한 요청을 적절한 핸들러 함수로 연결하는 데 사용됩니다.
const router: Router = Router();

// cookie-parser 미들웨어를 라우터에 적용합니다.
router.use(cookieParser());

// 라우터에 GET 요청 경로 '/'를 설정합니다. 이 경로로 요청이 들어오면 실행될 콜백 함수를 정의합니다.
// 함수는 Request와 Response 객체를 매개변수로 받아, 응답으로 'API is working' 문자열을 클라이언트에 보냅니다.
router.get('/', (req: Request, res: Response) => {
  res.send('API is working');
});

router.use('/users', userRoutes);

router.use('/categories', categoryRoutes);

router.use('/posts', postRoutes);

// 이 라우터를 다른 파일에서 사용할 수 있도록 기본으로 내보냅니다.
export default router;
