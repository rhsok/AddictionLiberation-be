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
            'Password must be least 8 character long and include at least one unmber one special character.'
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
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user.id);

      // 리프레시 토큰 데이터베이스에 저장
      await UserModel.setRefreshToken(user.id, refreshToken);
      // 쿠키에 refreshToken 저장
      sendRefreshToken(res, refreshToken);

      return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error('Login Error', error);
      return res.status(500).send('Error login in user.');
    }
  }

  async setRefreshToken(req: Request, res: Response): Promise<Response> {
    const token = req.cookies.jwt;
    // const authHeader = req.headers['authorization'];
    // const token =
    //   authHeader && authHeader.startsWith('Bearer ')
    //     ? authHeader.split(' ')[1] // "Bearer " 이후의 토큰 추출
    //     : null; // 토큰이 없으면 null로 설정

    if (!token) {
      return res.status(401).send('No token provided.');
    }
    const secret = process.env.REFRESH_TOKEN_SECRET || '';

    const decoded = verifyToken(token, secret);

    if (!decoded) {
      return res.status(403).send('Invalid refresh token.');
    }
    console.log(decoded.id);
    const user = await UserModel.findById(decoded.id);
    console.log('유저찾기', user);
    if (!user || !user.id) return res.status(404).send('User not found.');
    const accessToken = generateAccessToken(user);
    console.log('엑세스토큰 재발급', accessToken);
    return res.json({ token: accessToken });
  }

  async logoutUser(req: Request, res: Response): Promise<Response> {
    try {
      //클라이언트의 쿠키 삭제
      console.log('jw')
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      // const authHeader = req.headers['authorization'];
      // const token =
      //   authHeader && authHeader.startsWith('Bearer ')
      //     ? authHeader.split(' ')[1]
      //     : null;
      // if (!token) {
      //   return res.status(401).send('No token provieded.');
      // }
      // const decoded = verifyToken(token, secret);
      // if (!decoded) {
      //   return res.status(403).send('Invalid token.');
      // }
      // const userId = decoded.id;
      // const user = await UserModel.findById(userId);
      // if (!user) {
      //   return res.status(404).send('User not found.');
      // }

      // // 사용자 리프레시 토큰을 데이터베이스에서 제거
      // await UserModel.removeRefreshToken(userId);

      // 응답 설정 - 클라이언트에서 저장된 토큰을 제거하도록 지시
      return res.status(200).send('Logged out successfully.');
    } catch (error) {
      console.error('Logout Error', error);
      return res.status(500).send('Error logging out user.');
    }
  }
}

export default new UserController();
