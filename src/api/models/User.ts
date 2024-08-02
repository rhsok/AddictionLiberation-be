import { prisma } from '../../config/db';

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  refreshToken?: string | null;
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

  async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async setRefreshToken(userId: number, token: string): Promise<void> {
    console.log(`Setting refresh token for user ${userId}`); // 함수 시작 시 로그
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: token },
      });
      console.log(`Refresh token updated successfully for user ${userId}`); // 성공적인 업데이트 로그
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Failed to set refresh token for user ${userId}: ${error.message}`
        ); // 오류 발생 시 로그
        throw new Error(`Failed to update refresh token: ${error.message}`); // 오류를 다시 throw하여 호출자에게 전달
      }
    }
  }

  /**
   * 특정 ID로 사용자 검색
   * @param id 사용자 ID
   * @returns Promise<User | null>
   */
  async findById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }
}

export default new UserModel();
