//
// test-utils.js

import fs from 'fs/promises';
import path from 'path';

import { ensureDir, emptyDir } from 'fs-extra';

// const TEMPYTEMP = './test/tempytemp';
const TEMPYTEMP = path.join('test', 'tempytemp');

const resetTempytemp = async () => {
  await ensureDir(TEMPYTEMP);
  await emptyDir(TEMPYTEMP);
};


module.exports = {
  resetTempytemp,
};