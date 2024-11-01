import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// 사용자 정보 타입 정의
interface User extends JwtPayload {
  id: string; // 추가적으로 필요한 필드 정의 가능
  name: string;
  email: string;
  scope: string;
}

// Request 인터페이스 확장 (user 속성을 추가하여 확장)
export interface RequestWithUser extends Request {
  user?: User; // Optional로 사용자 정보 추가
}

const authenticateToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.headers['authorization'];
  console.log('ah', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  // console.log('토큰확인1', token);

  if (!token) {
    return res.sendStatus(401); // 토큰이 없을 경우 Unauthorized 상태 반환
  }

  // 토큰 검증
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decodedToken) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.sendStatus(403); // 토큰이 유효하지 않을 경우 Forbidden 상태 반환
    }

    if (!decodedToken) {
      console.log('Decoded token is null');
      return res.sendStatus(403);
    }
    req.user = decodedToken as User; // decodedToken은 JwtPayload 또는 string이므로, User 타입으로 캐스팅
    console.log('인증확인', req.user);

    next(); // 다음 미들웨어로 이동
  });
};

export default authenticateToken;
