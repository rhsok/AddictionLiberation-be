import { User } from '@prisma/client'; // Prisma User 타입을 가져옵니다.

declare global {
  namespace Express {
    interface Request {
      user?: User; // JWT에서 파싱된 사용자 정보
    }
  }
}
