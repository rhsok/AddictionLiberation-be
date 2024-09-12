import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface UserPayload {
  id: string;
}

const now = Math.floor(Date.now() / 1000);

// 액세스 토큰 생성, 15분 동안 유효
export const generateAccessToken = (user: any): string => {
  // 액세스 토큰 생성, 15분 동안 유효
  console.log('user', user);

  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      scope: 'read',
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '15m',
    }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
};

export const sendRefreshToken = (res: Response, token: string): void => {
  console.log('Setting refresh token cookie');
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/',
    // secure: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
