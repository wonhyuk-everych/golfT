import { defineEventHandler } from 'h3';

// Sample location data - this would typically come from a database
const locationList = [
  { name: '파타야 호텔', address: '태국 파타야 비치로드 123' },
  { name: '방콕 호텔', address: '태국 방콕 수쿰빗로드 456' },
  { name: '푸켓 리조트', address: '태국 푸켓 파통비치 789' },
  { name: '치앙마이 호텔', address: '태국 치앙마이 님만해민로드 101' },
  { name: '후아힌 리조트', address: '태국 후아힌 비치로드 202' },
  { name: '코사무이 빌라', address: '태국 코사무이 차웽비치 303' },
  { name: '크라비 리조트', address: '태국 크라비 아오낭비치 404' },
  { name: '파타야 콘도', address: '태국 파타야 워킹스트리트 505' },
  { name: '방콕 아파트먼트', address: '태국 방콕 시앙스퀘어 606' },
  { name: '푸켓 풀빌라', address: '태국 푸켓 카타비치 707' },
];

export default defineEventHandler(async (_event) => {
  const courseIdx = getQuery(_event).courseIdx
  
  const pool = getPool()
  const connection = await pool.getConnection()
  
  try {
    const query = `
      SELECT 
        location as name, address
      FROM golf_course_location 
      WHERE course_idx = ? AND use_yn = 'Y'
    `

    const [rows] = await connection.query(query, [courseIdx])
    
    return rows as { name: string; address: string }[]
  } catch (error) {
    console.error('Error fetching golf courses:', error)
    throw error
  } finally {
    connection.release()
  }
});
