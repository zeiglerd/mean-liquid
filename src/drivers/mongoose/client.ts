import mongoose from 'mongoose';

import * as env from '../../env';

export async function connect() {
  await mongoose.connect(env.dbUri());
}

export async function disconnect() {
  await mongoose.disconnect();
}
