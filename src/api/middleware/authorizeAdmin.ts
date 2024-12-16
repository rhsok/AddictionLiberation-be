import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client'; // Prisma User 타입을 가져옵니다.
import { RequestWithUser } from './authMiddleware';
import { prisma } from '../../config/db';

// declare global {
//   namespace Express {
//     interface Request {
//       userId?: User; // JWT에서 파싱된 사용자 정보
//     }
//   }
// }

export const authorizeAdmin = async(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId; // 로그인한 유저 정보 (JWT에서 추출)
  console.log('user', userId)

  const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

  if (!user || user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ message: '권한이 없습니다. 관리자만 접근 가능합니다.' });
  }

  next(); // 권한이 admin인 경우 다음 미들웨어로 넘어감
};
