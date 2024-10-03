import { HydratedDocument, model, Schema } from 'mongoose';

import {
  CREATED,
  APPLIED,
  APPLY_FAILED,
  REVERTED,
  REVERT_FAILED,
} from '../../../const';
import { IMigration } from '../../../types';

export type IMigrationDocument = HydratedDocument<IMigration>;

const migrationSchema = new Schema<IMigrationDocument>({
  dateCreated: { type: Date },
  dateApplied: { type: Date },
  dateReverted: { type: Date },
  name: { required: true, type: String },
  status: {
    type: String,
    enum: [
      CREATED,
      APPLIED,
      APPLY_FAILED,
      REVERTED,
      REVERT_FAILED,
    ],
    default: CREATED,
    required: true,
  },
}, { collection: 'CHANGELOG' });

export default model('Migration', migrationSchema);
