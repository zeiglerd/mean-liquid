import {
  CREATED,
  APPLIED,
  APPLY_FAILED,
  REVERTED,
  REVERT_FAILED,
} from './const';

export type IMigration = {
  dateCreated?: Date;
  dateApplied?: Date;
  dateReverted?: Date;
  name: string;
  status: typeof CREATED
        | typeof APPLIED
        | typeof APPLY_FAILED
        | typeof REVERTED
        | typeof REVERT_FAILED
        ;
}

export type Query = {
  name?: string;
  status?: string | { $in: Array<string> } | { $not: Array<string> };
}
