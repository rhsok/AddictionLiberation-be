import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
};
