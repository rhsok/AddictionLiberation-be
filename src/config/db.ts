import { PrismaClient } from '@prisma/client';
import redis, { createClient } from 'redis';
import dotenv from 'dotenv';
// 환경 변수에서 POSTGRES_URI 값을 읽어와 PostgreSQL 연결 풀을 생성합니다.

// 환경 변수를 로드합니다.
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Redis 클라이언트를 생성합니다. 환경 변수에서 REDIS_URI 값을 사용하여 Redis 서버에 연결합니다.
const redisClient = createClient({
  url: process.env.REDIS_URI,
});
// Redis 클라이언트에 대한 에러 리스너를 설정합니다. 에러 발생 시 콘솔에 에러 메시지를 출력합니다.
redisClient.on('error', (err) => console.log('Redis Client Error', err));
// Redis 클라이언트를 연결합니다. 이 호출을 통해 서버에 연결을 시도합니다.
redisClient.connect();

export { redisClient, prisma };
