import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../../lib/jwtUtil';

// 리프레시토큰 타입
interface refreshToken extends JwtPayload {
  userId: string; // 추가적으로 필요한 필드 정의 가능
}

// Request 인터페이스 확장 (user 속성을 추가하여 확장)
export interface RequestWithUser extends Request {
  userId?: string; // Optional로 사용자 정보 추가
}

const authenticateToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  // Authorization 헤더에서 토큰 추출
  const token = req.cookies.jwt;

  if (!token) {
    return res.sendStatus(401); // 토큰이 없을 경우 Unauthorized 상태 반환
  }

  const secret = process.env.REFRESH_TOKEN_SECRET || '';
  // 토큰 검증
  const decoded = verifyToken(token, secret) 

  if (!decoded) {
    return res.status(403).send('Invalid refresh token.');
  }

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decodedToken) => {
  //   if (err) {
  //     console.error('Token verification error:', err);
  //     return res.sendStatus(403); // 토큰이 유효하지 않을 경우 Forbidden 상태 반환
  //   }

  //   if (!decodedToken) {
  //     console.log('Decoded token is null');
  //     return res.sendStatus(403);
  //   }
  //   req.user = decodedToken as User; // decodedToken은 JwtPayload 또는 string이므로, User 타입으로 캐스팅
  //   console.log('인증확인', req.user);

  //   next(); // 다음 미들웨어로 이동
  // })
  req.userId = decoded.id;  // decodedToken은 JwtPayload 또는 string이므로, User 타입으로 캐스팅
  console.log('인증확인', req.userId);

  next(); // 다음 미들웨어로 이동
};

export default authenticateToken;
