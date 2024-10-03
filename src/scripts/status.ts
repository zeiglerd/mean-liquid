import commandLineArgs from 'command-line-args';

import * as env from '../env';
import Migration from '../drivers/mongoose/models/Migration';
import { Query } from '../types';
import {
  wrapper,
  writeToLog,
} from '../util';

env.dbUri();
env.migrationDir();
env.migrationLog();

const options = commandLineArgs([
  { name: 'names', type: String, multiple: true, defaultOption: true },
]);

(async () => await wrapper(async () => {
  const query: Query = {};

  if (options.names && options.names?.length) {
    for (const name of options.names) {
      query.name = name;
      const migration = await Migration.findOne(query);
      if (!migration) {
        throw Error(`Did not find migration: ${name}.`);
      }
      await writeToLog(migration);
    }
  } else {
    const migrations = await Migration.find(query);
    if (!migrations) {
      throw Error('Did not find any migration(s).');
    }
    for (const migration of migrations) {
      await writeToLog(migration);
    }
  }
}))();
