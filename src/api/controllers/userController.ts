import { Request, Response } from 'express';
import UserModel from '../models/User';
import bcrypt from 'bcrypt';
import { hashPassword } from '../../lib/passwordUtil';
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  verifyToken,
} from '../../lib/jwtUtil';
import { isEmailValid, isPasswordValid } from '../../lib/validation';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.REFRESH_TOKEN_SECRET ?? 'default_secret_not_safe';

class UserController {
  // 회원가입 처리 메서드
  async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      // 요청에서 사용자 정보 추출
      const { username, email, password } = req.body;

      if (!isEmailValid(email)) {
        return res.status(400).send('Inavild email format');
      }

      if (!isPasswordValid(password)) {
        return res
          .status(400)
          .send(
            'Password must be least 8 character long and inclue at least one unmber one special character.'
          );
      }
      // 비밀번호 해싱
      const hashedPassword = await hashPassword(password);
      // 사용자 생성
      const userId = await UserModel.createUser({
        username,
        email,
        password: hashedPassword,
      });
      // 성공 응답
      return res.status(201).send('User registerd successfully');
    } catch (error) {
      console.error('Registration Error', error);
      return res.status(500).send('Error registering user.');
    }
  }

  async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!isEmailValid(email)) {
        return res.status(400).send('Invail email format.');
      }
      const user = await UserModel.findUserByEmail(email);
      if (!user?.id) return res.status(401).send('Invaild credentials.');

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Invaild credentials.');
      }
      //JWT 토큰 생성
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      sendRefreshToken(res, refreshToken);
      return res.status(200).json({ accessToken });
    } catch (error) {
      console.error('Login Error', error);
      return res.status(500).send('Error logggin in user.');
    }
  }

  async setRefreshToken(req: Request, res: Response): Promise<Response> {
    const token = req.cookies.jid;
    if (!token) {
      return res.status(401).send('No token provided.');
    }

    const decoded = verifyToken(token, secret);
    if (!decoded) {
      return res.status(403).send('Invalid refresh token.');
    }
    console.log(decoded);
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.id) return res.status(404).send('User not found.');
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    sendRefreshToken(res, refreshToken);
    return res.json({ accessToken });
  }
}

export default new UserController();
