import dotenv from 'dotenv';
dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URI: string;
      MIGRATIONS_DIR: string;
      MIGRATIONS_LOG: string;
    }
  }
}

export function dbUri() {
  if (!process.env.DB_URI) {
    throw Error('`DB_URI` must be defined in `.env` file.');
  }
  return process.env.DB_URI;
}

export function migrationDir() {
  if (!process.env.MIGRATIONS_DIR) {
    throw Error('`MIGRATIONS_DIR` must be defined in `.env` file.');
  }
  return process.env.MIGRATIONS_DIR;
}

export function migrationLog() {
  if (!process.env.MIGRATIONS_LOG) {
    throw Error('`MIGRATIONS_LOG` must be defined in `.env` file.');
  }
  return process.env.MIGRATIONS_LOG;
}
