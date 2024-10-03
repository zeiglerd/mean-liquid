import commandLineArgs from 'command-line-args';

import {
  CREATED,
  APPLIED,
  APPLY_FAILED,
  REVERTED,
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
  { name: 'force', alias: 'f', type: Boolean },
]);

if ((!options.names || !options.names?.length) && !options.all) {
  throw Error('Must specify migration(s) to apply; or, use the `--all` flag.');
}

(async () => await wrapper(async () => {
  const query: Query = { status: { $in: [CREATED, REVERTED] } };

  if (options.all) {
    if (options.force) {
      console.log('Skipping `force` option while migrating `all`.');
    }

    const migrations = await Migration.find(query);
    if (!migrations) {
      throw Error('Did not find any migration(s) to apply.');
    }
    for (const migration of migrations) {
      await up(migration);
    }
  } else if (options.names && options.names.length) {
    if (options.force) {
      delete query.status;
    }

    for (const name of options.names) {
      query.name = name;
      const migration = await Migration.findOne(query);
      if (!migration) {
        throw Error(`Did not find migration to apply: ${name}.`);
      }
      await up(migration);
    }
  }
}))();

async function up(migration: IMigrationDocument) {
  try {
    const { up } = await import(migrationsFilepath(migration.name, migration._id));

    const applied = await up();

    if (!applied) {
      throw Error(`Did not apply migration: ${migration.name} (${migration._id}).`);
    }

    migration.dateApplied = new Date();
    migration.status = APPLIED;
  } catch (error: any) {
    if (migration) {
      migration.status = APPLY_FAILED;
    }

    throw error;
  } finally {
    if (migration) {
      await migration.save();
      await writeToLog(migration);
    }
  }
}
