import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    })
  }
  return pool
}

// Test the connection
export const testConnection = async () => {
  try {
    const connection = await getPool().getConnection()
    console.log('Successfully connected to MySQL database')
    connection.release()
    return true
  } catch (error) {
    console.error('Error connecting to MySQL database:', error)
    return false
  }
}

export default getPool()
