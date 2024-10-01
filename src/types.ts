import {
  CREATED,
  MIGRATED,
  MIGRATION_FAILED,
  REVERTED,
  REVERT_FAILED,
} from './const';

export type IMigration = {
  dateCreated?: Date;
  dateMigrated?: Date;
  dateReverted?: Date;
  name: string;
  status: typeof CREATED
        | typeof MIGRATED
        | typeof MIGRATION_FAILED
        | typeof REVERTED
        | typeof REVERT_FAILED
        ;
}

export type Query = {
  name?: string;
  status?: string | { $in: Array<string> } | { $not: Array<string> };
}
