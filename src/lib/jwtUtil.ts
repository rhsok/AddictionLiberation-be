import jwt from 'jsonwebtoken';
// 액세스 토큰 생성, 15분 동안 유효
export const generateAccessToken = (userId: number): string => {
  // 액세스 토큰 생성, 15분 동안 유효
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};
