import express from 'express';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('../swagger.json'); // Swagger 문서 파일 경로

// Express 애플리케이션 인스턴스를 생성합니다.
const app: express.Application = express();
const port: number | string = process.env.PORT || 8000;

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 라우트
app.use('/api', require('./api/routes'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
