import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface UserPayload {
  id: string;
}

const now = Math.floor(Date.now() / 1000);

// 액세스 토큰 생성, 15분 동안 유효
export const generateAccessToken = (user: any): string => {
  // 액세스 토큰 생성, 15분 동안 유효


  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '15m',
    }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '14d',
  });
};

export const sendRefreshToken = (res: Response, token: string): void => {
  console.log('Setting refresh token cookie');
  res.cookie('jwt', token, {
    httpOnly: true, // JavaScript에서 접근 불가
    secure: true, // HTTPS 환경에서만 전송
    sameSite: 'none', // CSRF 방지
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
  });
};

export const verifyToken = (
  token: string,
  secret: string
): UserPayload | null => {
  try {
    return jwt.verify(token, secret) as UserPayload;
  } catch (error) {
    return null;
  }
};
