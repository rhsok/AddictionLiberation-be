// 'pg' 라이브러리에서 'Pool' 클래스를 임포트합니다. Pool을 사용하면 PostgreSQL 데이터베이스 연결을
// 효율적으로 관리할 수 있습니다. 연결 풀은 여러 데이터베이스 연결을 미리 생성하고,
// 필요할 때 재사용하여 연결과 해제에 드는 비용을 절감합니다.
import { Pool } from 'pg'
import redis from 'redis'
// 환경 변수에서 POSTGRES_URI 값을 읽어와 PostgreSQL 연결 풀을 생성합니다.
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
})
// Redis 클라이언트를 생성합니다. 환경 변수에서 REDIS_URI 값을 사용하여 Redis 서버에 연결합니다.
const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
})
// Redis 클라이언트에 대한 에러 리스너를 설정합니다. 에러 발생 시 콘솔에 에러 메시지를 출력합니다.
redisClient.on('error', (err) => console.log('Redis Client Error', err))
// Redis 클라이언트를 연결합니다. 이 호출을 통해 서버에 연결을 시도합니다.
redisClient.connect()

export { pool, redisClient }
