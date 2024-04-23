

import _ from 'lodash';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';


import {
  DEFAULT_RECORD_TAG,
} from './constants.js';

const argv = yargs(hideBin(process.argv))
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Filepath to where object (3D) output file is saved - same behavior as Openscad',
  })
  .option('jsonoutput', {
    alias: 'j',
    type: 'string',
    description: 'Filepath to where JSON output file is saved',
  })
  .option('record', {
    alias: 'r',
    type: 'string',
    description: `Custom "record" tag to be used in the scad file echo(<record>, <prop path>, <prop val>) when recording (Instead of using the default "${DEFAULT_RECORD_TAG}")`,
  })
  .option('inject', {
    alias: 'i',
    type: 'string',
    description: 'Scad code that gets directly injected - corresponds directly to openscad cli option -D (i.e. it takes scad statments like "asdf=23;blue=34;"',
  })
  .option('quiet', {
    alias: 'q',
    type: 'boolean',
    description: 'When quiet is sent, nothing will be logged. Data will only be saved to file (and also returned)',
  })
  .parse();

const argsConfig = {
  INPUT_FILE: _.last(argv._) || undefined,
  OUTPUT_FILE: argv.output || undefined,
  JSON_OUTPUT_FILE: argv.jsonoutput || undefined,
  RECORD_TAG: argv.record || DEFAULT_RECORD_TAG,
  SCAD_INJECTION: argv.inject || undefined,
  QUIET: argv.quiet || false,
};

console.log({argsConfig});

export const config = {
  ...argsConfig,
  INIT_CWD: process.env.INIT_CWD,
  PWD: process.env.PWD,
};
