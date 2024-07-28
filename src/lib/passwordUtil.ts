import bcrypt from 'bcrypt';
// 해시를 생성할 때 사용할 소금 회수
const saltRounds = 10;
// 비밀번호 해싱 함수: 비밀번호를 안전하게 저장하기 위해 해시를 생성
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};
