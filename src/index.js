
import fs from 'fs/promises';
import { spawn } from 'child_process';
import _ from 'lodash';

import { ECHO_TAG } from './constants.js';
import { config } from './config.js';

import {
  extractDefaultOutputFile,
  validateParams,
  wrapRecordTag,
  condenseJson,
} from './utils.js';

import { parseSummary } from './scad-summary-parser.js';

const WARNING_START = 'WARNING:';
const ERROR_START = 'ERROR';

const createLogger = (isQuiet) => ({
  log: isQuiet ? () => undefined : console.log,
  info: isQuiet ? () => undefined : console.info,
});

export const runScad = async ({
  inputFile,
  jsonOutputFile,
  outputFile,
  scadInjection,
  recordTag,
  isQuiet,
}) => {
  const resolvedInputFile = inputFile || config.INPUT_FILE;
  const params = {
    inputFile: resolvedInputFile,
    jsonOutputFile: jsonOutputFile || config.JSON_OUTPUT_FILE || extractDefaultOutputFile(resolvedInputFile, true),
    outputFile: outputFile || config.OBJECT_OUTPUT_FILE || extractDefaultOutputFile(resolvedInputFile, false),
    scadInjection: scadInjection || config.SCAD_INJECTION,
    recordTag: recordTag || config.RECORD_TAG,
    isQuiet: _.isBoolean(isQuiet) ? isQuiet : config.QUIET,
  };
  const logger = createLogger(params.isQuiet);
  logger.info('\n***    BEGIN recording     ***');
  logger.info(`CONFIG = ${JSON.stringify(config, null, 2)}`);
  validateParams(params);
  logger.info({params});
  const wrappedRecordTag = wrapRecordTag(params.recordTag);

  const openscadRes = await new Promise((resolve, reject) => {
    
    const recorderLines = []; // mutates!!  
    const echoLines = []; // mutates!!
    const warningLines = []; // mutates!!
    const openscadLines = []; // mutates!!

    const openscadArgs = _.compact(
      [
        '-o', params.outputFile,
        params.scadInjection ? `-D ${params.scadInjection}` : null,
        params.inputFile,
      ],
    );
    const openscadRunner = spawn('openscad', openscadArgs);
      
    openscadRunner.stdout.on('data', (data) => {
      reject(new Error('No data is expected', {data: data.toString()}));
    });
  
    openscadRunner.stderr.on('data', (data) => {
  
      const output = data.toString();
      const lines = output.split('\n');
      
      _.each(lines, line => {
        const isEcho = line.startsWith(ECHO_TAG);
        const isWarning = line.startsWith(WARNING_START);
        const isError = line.startsWith(ERROR_START);        
        if (isEcho) {
          const trimmed = line.substring(ECHO_TAG.length).trim();
          if (trimmed.startsWith(wrappedRecordTag)) {
            const abridged = trimmed.substring(wrappedRecordTag.length).trim();
            recorderLines.push(abridged);
          }
          else {
            echoLines.push(line);
          }
        }
        else if (isWarning || isError) {
          warningLines.push(line);
        }
        else {
          openscadLines.push(line);
        }
      });
  
    });
  
    openscadRunner.on('close', (code) => {
  
      // process recordings
      const recordedData = {}; // is mutated!!
      if (recorderLines.length) {
        _.each(recorderLines, line => {
          // replace scad 'undef' vals to 'null'
          const arredLine = `[${line.replace('undef', 'null')}]`;
          try {
            const itemArr = JSON.parse(arredLine);      
            if (itemArr.length !== 2) {
              reject(new Error(`Recorded args MUST be a key/value pair (i.e. length 2) but found ${itemArr.length}: ${itemArr}`));
            }
            const compoundKey = itemArr[0];
            const value = itemArr[1];
            const keys = compoundKey.split('.');
            _.set(recordedData, keys, value);
          } catch (err) {
            reject(new Error(`Cannot create a JSON array from the supplied ${params.recordTag} line: <<${arredLine}>>`));
          }
        });
      }

      const summary = parseSummary(openscadLines);

      // just print the standard (non-recording) ECHO lines?
      if (echoLines.length) {
        logger.info('\n***    REGULAR Echo lines  ***');
        echoLines.forEach(line => {
          logger.info(line);
        });
      }

      // print any warning lines
      if (warningLines.length) {
        warningLines.info('\n***    WARNING   ***');
        warningLines.forEach(line => {
          logger.info(line);
        });
      }


      // also print the system synopsis
      if (openscadLines.length) {
        const filteredOthers = _.filter(openscadLines, line => line.length);
        if (filteredOthers.length) {
          logger.info('\n***    OpenSCAD lines      ***');
          filteredOthers.forEach(line => {
            logger.info(line);
          });
        }
      }
      
      logger.log(`\nchild process exited with code ${code}`);
      logger.log('\n***    RECORDED values     ***');
      logger.log(recordedData)

      // return all pieces
      resolve({
        data:recordedData,
        summary,
        echoLines,
        recorderLines,
        openscadLines,
        warningLines,
      });
      
    });

  });

  const prettyJson = JSON.stringify(openscadRes.data, null, 2);
  const condensedJson = condenseJson(prettyJson);
  await fs.writeFile(params.jsonOutputFile, condensedJson);

  // return relevant details
  return openscadRes;
};



