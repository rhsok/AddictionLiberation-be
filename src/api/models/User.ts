import { prisma } from '../../conifg/db';

interface User {
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
}

class UserModel {
  // 비동기 함수로 사용자를 생성하는 메서드
  async createUser(user: User): Promise<number> {
    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      throw new Error('이메일이 이미 존재합니다.');
    }

    const createdUser = await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        refreshToken: user.refreshToken,
      },
    });
    return createdUser.id;
  }

  async setRefreshToken(userId: number, token: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}

export default new UserModel();
