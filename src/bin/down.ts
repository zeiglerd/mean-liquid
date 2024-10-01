import commandLineArgs from 'command-line-args';

import {
  CREATED,
  MIGRATED,
  REVERTED,
  REVERT_FAILED,
} from '../const';
import * as env from '../env';
import Migration, { IMigrationDocument } from '../drivers/mongoose/models/Migration';
import { Query } from '../types';
import {
  migrationsFilepath,
  wrapper,
  writeToLog,
} from '../util';

env.dbUri();
env.migrationDir();
env.migrationLog();

const options = commandLineArgs([
  { name: 'names', type: String, multiple: true, defaultOption: true },
  { name: 'all', alias: 'a', type: Boolean },
  { name: 'reset', alias: 'r', type: Boolean },
]);

if ((!options.names || !options.names?.length) && !options.all) {
  throw Error('Must specify migration(s) to revert; or, use the `--all` flag.');
}

(async () => await wrapper(async () => {
  const query: Query = { status: MIGRATED };

  if (options.all) {
    const migrations = await Migration.find(query);
    if (!migrations) {
      throw Error('Did not find any migration(s) to revert.');
    }
    for (const migration of migrations) {
      await down(migration);
    }
  } else if (options.names && options.names.length) {
    for (const name of options.names) {
      query.name = name;
      const migration = await Migration.findOne(query);
      if (!migration) {
        throw Error(`Did not find migration to revert: ${name}.`);
      }
      await down(migration);
    }
  }
}))();

async function down(migration: IMigrationDocument) {
  try {
    const { down } = await import(migrationsFilepath(migration.name, migration._id));

    const reverted = await down();

    if (!reverted) {
      throw Error(`Did not revert migration: ${migration.name} (${migration._id}).`);
    }

    if (options.reset) {
      migration.dateMigrated = undefined;
      migration.dateReverted = undefined;
      migration.status = CREATED;
    } else {
      migration.dateReverted = new Date();
      migration.status = REVERTED;
    }
  } catch (error: any) {
    if (migration) {
      migration.status = REVERT_FAILED;
    }

    throw error;
  } finally {
    if (migration) {
      await migration.save();
      await writeToLog(migration);
    }
  }
}
