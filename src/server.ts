import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { redisClient, prisma } from './config/db';
import routes from './api/routes';

// 환경 변수를 로드합니다.
dotenv.config();

// Swagger 문서를 로드합니다. 이 문서는 API의 구조와 동작을 정의합니다.
const swaggerDocument = require('./swagger'); // Swagger 문서 파일 경로

// Express 애플리케이션 인스턴스를 생성합니다.
const app: express.Application = express();

// 환경 변수에서 포트를 가져오거나, 설정되어 있지 않으면 8000을 기본값으로 사용합니다.
const port: number | string = process.env.PORT || 8000;

// CORS 설정에 환경 변수 사용
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // 환경 변수에서 도메인 가져오기
  optionsSuccessStatus: 200, // 일부 레거시 브라우저의 호환성을 위해
  credentials: true,
};
// CORS 미들웨어를 사용하여 모든 출처에서의 요청을 허용합니다.
app.use(cors(corsOptions));

// JSON 요청 본문을 파싱하기 위해 express.json 미들웨어를 사용합니다.
app.use(express.json());

// '/api-docs' 경로에서 Swagger UI를 제공합니다. 이 UI를 통해 API를 문서화하고 상호 작용할 수 있습니다.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 기본 API 라우트를 설정합니다. 모든 API 엔드포인트는 '/api'로 시작합니다.
app.use('/api', routes);

// '/health' 경로에서 데이터베이스 및 Redis 연결 상태를 확인합니다.
app.get('/health', async (req, res) => {
  try {
    //PostgreSQL 연결 확인
    const pgResult = await prisma.$queryRaw`SELECT NOW()`;
    //Redis 연결 확인
    await redisClient.set('health', 'ok');
    const redisResult = await redisClient.get('health');

    res.send({
      postgres: pgResult,
      redis: redisResult,
    });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

// 설정된 포트에서 서버를 시작하고, 서버가 정상적으로 시작되면 콘솔에 메시지를 출력합니다.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
