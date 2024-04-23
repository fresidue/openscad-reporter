//
// utils.js

import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';

import {
  ORDERED_OUTPUT_EXTENSIONS,
  DEFAULT_OUTPUT_EXTENSION,
} from './constants.js';


export const extractDefaultOutputFile = (inputFile, isJson) => {
  if (!_.isString(inputFile)) {
    return null;
  }
  const parts = inputFile.split('.');
  parts.pop();
  const prefix = inputFile[0] === '.' ? '' : '';
  const fileBase = parts.join('.');
  const suffix = isJson ? 'json' : DEFAULT_OUTPUT_EXTENSION;
  const file = `${prefix}${fileBase}.${suffix}`;
  return file;
};



const isScadFile = (filePath) => {
  const extension = filePath.split('.').pop();
  const isScad = extension === 'scad';
  return isScad;
};

const isJsonFile = (filePath) => {
  const extension = filePath.split('.').pop();
  const isJson = extension === 'json';
  return isJson;
};

const isValidOutputExtension = (filePath) => {
  const extension = filePath.split('.').pop();
  const isModelObject = _.includes(ORDERED_OUTPUT_EXTENSIONS, extension);
  return isModelObject;
};

const directoryExists = (filePath) => {
  const dir = path.parse(filePath).dir || './';
  const exists = fs.existsSync(dir);
  return exists;
};

const createDirectory = (filePath) => {
  console.log({filePath});
  const dir = path.parse(filePath).dir;
  console.log({dir});
  fs.mkdirSync(dir);
};

const fileExists = (filePath) => {
  const exists = fs.existsSync(filePath);
  return exists;
};

export const validateParams = ({
  inputFile,
  jsonOutputFile,
  outputFile,
  recordTag,
}) => {

  if (!_.isString(recordTag) || !_.size(recordTag)) {
    throw new Error('The "record" tag must be a non-empty string. recordTag = ', recordTag);
  }

  if (!inputFile) {
    throw new Error('Input file must be included, and must be a scad file');
  }
  if (!isScadFile(inputFile)) {
    throw new Error(`Input file MUST be a scad file, but is currently = ${inputFile}`);
  }
  if (!fileExists(inputFile)) {
    throw new Error(`The input scad file cannot be found: ${inputFile}`);
  }


  if (!jsonOutputFile) {
    throw new Error('No jsonOutputFile has been specified, and default is not set from inputFile');
    // console.info('jsonOutputFile has been omitted');
  }
  else {
    const extension = jsonOutputFile.split('.').pop();
    if (extension !== 'json') {
      throw new Error(`Invalid jsonoutput file extension "${extension}", must be "json"`);
    }
  }
 
  
  console.log('asdfasdfasdf', {outputFile});
  if (!outputFile) {
    throw new Error('"outputFile" has been omitted and was NOT set from inputFile for some reason');
  }
  else {
    if (!isValidOutputExtension(outputFile)) {
      throw new Error(`invalid output file extension "${outputFile.split('.').pop()}" as it is not not one of the expected: [${ORDERED_OUTPUT_EXTENSIONS.join(', ')}]`);
    }
    console.log('survasdfasdf', {outputFile});

    if (!directoryExists(outputFile)) {
      console.log('directoryExists');
      createDirectory(outputFile);
    }
  
  }
 };

export const wrapRecordTag = (tag) => {
  const wrapped = `"${tag}",`;
  return wrapped;
};


export const condenseJson = (prettyJson) => {
  const lines = _.split(prettyJson, '\n');
  const numLines = _.size(lines);

  const condensers = []; // gets mutated!!
  _.times(numLines, (startIndex) => {
    const startLine = lines[startIndex];

    let arrStartParts = _.split(startLine, ': [');    
    let isArrStarter = arrStartParts.length == 2 && arrStartParts[1] === '';
    let isSubArray = false;
    if (!isArrStarter) {
      arrStartParts = _.split(startLine, '[');
      isArrStarter = arrStartParts.length == 2 && _.trim(startLine) === '[';
      isSubArray = true;
    }
    
    // try next one
    if (!isArrStarter) {
      return; 
    }
    
    const arrItems = []; // gets mutated!!
    let usesComma = true;
    let canBeCondensed = true;
    _.each(lines.slice(startIndex + 1), (itemLine) => {
      // determine what we have
      const trimmedItem = _.trim(itemLine, ' ,');
      const isNumber = _.toString(_.toNumber(trimmedItem)) === trimmedItem;
      const isString = _.first(trimmedItem) === '"';
      const isNull = trimmedItem === 'null';
      const isEnder = trimmedItem === ']';
      // if we have a VALID item, then PUSH
      if (isNumber || isString || isNull) {
        arrItems.push(trimmedItem);
      }
      // if we have an ender, then stop and record
      else if (isEnder) {
        usesComma = _.trim(itemLine) !== trimmedItem;
        canBeCondensed = true;
        return false;
      }
      // if invalid, then abort
      else {
        canBeCondensed = false;
        return false;
      }
    });
    if (canBeCondensed) {
      condensers.push({
        startIndex,
        arrStart: arrStartParts[0],
        isSubArray,
        arrItems,
        usesComma,
      });
    }


  });
  condensers.reverse(); // remove from the back
  
  // do the condensing
  const condensedLines = lines.slice(); // is mutated!!
  _.each(condensers, condenser => {
    const replacement = `${condenser.arrStart}${condenser.isSubArray ? '' : ': '}[${condenser.arrItems.join(', ')}]${condenser.usesComma ? ',' : ''}`;
    condensedLines.splice(
      condenser.startIndex,
      condenser.arrItems.length + 2,
      replacement,
    );
  });
  
  // rejoin and return
  const condensedJson = condensedLines.join('\n');
  return condensedJson;
};


