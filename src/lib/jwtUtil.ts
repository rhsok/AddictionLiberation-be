import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface UserPayload {
  id: number;
}

// 액세스 토큰 생성, 15분 동안 유효
export const generateAccessToken = (userId: number): string => {
  console.log('ev', process.env.JWT_ACCESS_SECRET);
  // 액세스 토큰 생성, 15분 동안 유효
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
};

export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/',
    secure: true,
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
