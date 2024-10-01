import { PRINT_PRIORITY } from './const';
import * as env from './env';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { connect, disconnect } from './drivers/mongoose/client';
import { IMigrationDocument } from './drivers/mongoose/models/Migration';
import { ObjectId } from './drivers/mongoose/types';

function migrationsDirectory() {
  return `${process.cwd()}/${env.migrationDir()}`;
}

function migrationsDirectoryCreate() {
  mkdirSync(migrationsDirectory());
  if (existsSync(migrationsDirectory())) {
    return true;
  }
  throw Error(`Failed creating migrations directory: ${migrationsDirectory()}.`);
}

function migrationsDirectoryExistsOrCreate() {
  if (existsSync(migrationsDirectory())) {
    return true;
  }
  return migrationsDirectoryCreate();
}

export function migrationsFilepath(name: string, id: ObjectId) {
  migrationsDirectoryExistsOrCreate();
  return `${migrationsDirectory()}/${name}-${id}.ts`;
}

function migrationsLogFilepath() {
  return `${process.cwd()}/${env.migrationLog()}`;
}

export async function templateFilepath(template: string) {
  return await readFileSync(`${__dirname}/templates/${template}.ts`);
}

export async function wrapper(fn: Function) {
  try {
    await connect();
    await fn();
  } catch (error: any) {
    console.log({ error });
  } finally {
    await disconnect();
  }
}

export async function writeToLog(migration: IMigrationDocument) {
  let s = `${migration.name}-${migration._id} ${migration.status}`;

  for (const key of PRINT_PRIORITY) {
    const keyTyped = key as keyof IMigrationDocument;
    if (migration[keyTyped]) {
      s += ` on ${migration[keyTyped]}`;
      break;
    }
  }

  await writeFileSync(`${migrationsLogFilepath()}`, `${s}\n`, { flag: 'a+' });

  console.log(s);
}
