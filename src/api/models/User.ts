import { pool } from '../../conifg/db';

interface User {
  username: string;
  email: string;
  password: string;
}

class UserModel {
  // 비동기 함수로 사용자를 생성하는 메서드
  async createUser(user: User): Promise<void> {
    // SQL 쿼리 문자열
    const query = `INSERT INTO users(username, email, password) VALUES($1, $2, $3)`;
    // 사용자 데이터 배열
    const values = [user.username, user.email, user.password];
    // 데이터베이스에 쿼리 실행
    await pool.query(query, values);
  }

  // 필요한 경우 추가 사용자 관련 메소드를 여기에 구현
}

export default new UserModel();
