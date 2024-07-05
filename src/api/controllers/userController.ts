import { Request, Response } from 'express';
import UserModel from '../models/User';
import { hashPassword } from '../../lib/passwordUtil';

class UserController {
  // 회원가입 처리 메서드
  async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      // 요청에서 사용자 정보 추출
      const { username, email, password } = req.body;
      // 비밀번호 해싱
      const hashedPassword = await hashPassword(password);
      // 사용자 생성
      await UserModel.createUser({ username, email, password: hashedPassword });
      // 성공 응답
      return res.status(201).send('User registerd successfully');
    } catch (error) {
      console.error('Registration Error', error);
      return res.status(500).send('Error registering user.');
    }
  }
}

export default new UserController();
