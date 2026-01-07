declare module 'mysql2/promise' {
  export interface Pool {
    getConnection(): Promise<PoolConnection>;
    query(sql: string, values?: any): Promise<any>;
    end(): Promise<void>;
  }

  export interface PoolConnection {
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    query(sql: string, values?: any): Promise<any>;
    release(): void;
  }

  export interface PoolOptions {
    host: string;
    port?: number;
    user: string;
    password: string;
    database: string;
    charset?: string;
    waitForConnections?: boolean;
    connectionLimit?: number;
    queueLimit?: number;
  }

  export function createPool(options: PoolOptions): Pool;
}
