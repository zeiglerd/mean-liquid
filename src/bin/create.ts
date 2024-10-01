import commandLineArgs from 'command-line-args';
import { writeFileSync } from 'fs';

import * as env from '../env';
import Migration, { IMigrationDocument } from '../drivers/mongoose/models/Migration';
import {
  migrationsFilepath,
  templateFilepath,
  wrapper,
  writeToLog,
} from '../util';

env.dbUri();
env.migrationDir();
env.migrationLog();

const options = commandLineArgs([
  { name: 'names', type: String, multiple: true, defaultOption: true },
]);

if (!options.names || !options.names?.length) {
  throw Error(`Must specify migration(s) to create.`);
}

(async () => await wrapper(async () => {
  for (const name of options.names) {
    const migration = await Migration.create({
      dateCreated: new Date(),
      name,
    });
    await create(migration);
  }
}))();

async function create(migration: IMigrationDocument) {
  try {
    const template = await templateFilepath('migration');
    await writeFileSync(migrationsFilepath(migration.name, migration._id), template, {});
  } catch (error: any) {
    throw error;
  } finally {
    if (migration) {
      await writeToLog(migration);
    }
  }
}
