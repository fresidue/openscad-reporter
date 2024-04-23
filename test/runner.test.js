//
// runner.test.js
import _ from 'lodash';
import fs from 'fs/promises';
import assert from 'assert';
import { describe, test, beforeEach, afterEach } from 'vitest';

import {runScad} from '../src';
import {resetTempytemp} from './test-utils';

describe('runner.test ()', () => {

  beforeEach(async () => {
    // await resetTempytemp();
  });
  afterEach(async () => {
    // await resetTempytemp();
  });


  test('invalids', async () => {

    const invalids = [
      // // invalid inputFile
      {
        config: {},
        mess: /Input file must be included, and must be a scad file/,
      },
      {
        config: {inputFile: 'adsf'},
        mess: /Input file MUST be a scad file, but is currently = adsf/,
      },
      {
        config: {inputFile: 'nonexistent.scad'},
        mess: /The input scad file cannot be found: nonexistent.scad/,
      },

      // // invalid jsonOutputFile (DEFAULT takes name from inputFile if not set)

      {
        config: {
          inputFile: 'test/scads/example.scad', 
          jsonOutputFile: 'asdf'
        },
        mess: /Invalid jsonoutput file extension "asdf", must be "json"/,
      },
      {
        config: {
          inputFile: 'test/scads/example.scad', 
          jsonOutputFile: 'data.asdf'
        },
        mess: /Invalid jsonoutput file extension "asdf", must be "json"/,
      },

      // invalid outputFile (DEFAULT takes name from inputFile if not set (with stl extension))

      {
        config: {
          inputFile: 'test/scads/example.scad',
          jsonOutputFile: 'test/tempytemp/xxx/data.json',
          outputFile: 'test/tempytemp/xxx/invalidName.stlllll',
        },
        mess: /invalid output file extension/,
      },
    ];

    await Promise.all(_.map(invalids, async ({config, mess}) => {
      await assert.rejects(async () => runScad(config), mess);
    }));

  });

  test.skip('trivial valid example', async () => {

    const runnerRes = await runScad({
      inputFile: 'test/scads/example.scad',
      outputFile: 'test/tempytemp/output.json',
      objectOutputFile: 'test/tempytemp/object-output.stl',
    });
    const expectedRes = {
      data: {
        AAA: [ 1, 2, [ 'a', true, false, 0, null ] ],
        a: { b: { c: {d: 23} } },
        sploof: null
      },
      summary: {
        geometriesNum: 1,
        geometriesCacheSizeBytes: 728,
        cgalPolyhedronsNum: 0,
        cgalCacheSizeBytes: 0,
        isSimple: 0,
        numVertices: 0,
        numHalfedges: 0,
        numEdges: 0,
        numHalffacets: 0,
        numFacets: 6,
        numVolumes: 0
      },
      echoLines: [],
      recorderLines: [
        '"AAA", [1, 2, ["a", true, false, 0, undef]]',
        '"a.b.c.d", 23',
        '"sploof", undef'
      ],
      openscadLines: [
        '',
        'Geometries in cache: 1',
        'Geometry cache size in bytes: 728',
        'CGAL Polyhedrons in cache: 0',
        'CGAL cache size in bytes: 0',
        'Total rendering time: 0:00:00.000',
        '   Top level object is a 3D object:',
        '   Facets:          6',
        ''
      ],
      warningLines: [],
    };
    console.log({runnerRes});
    assert.deepStrictEqual(runnerRes, expectedRes);

    // there should be two files
    const dirContents = await fs.readdir('./test/tempytemp');
    console.log({dirContents});
    assert.strictEqual(dirContents.length, 2);

    // read the generated json file. sploof should be null
    const data = require('./tempytemp/output.json');
    console.log({data});
    assert.strictEqual(data.sploof, null);

    // test tempyTemp
    await resetTempytemp();
    const finalDirContents = await fs.readdir('./test/tempytemp');
    assert.strictEqual(finalDirContents.length, 0);
  });

  test.skip('valid example where output files are placed into separate subdirectories', async () => {

    await runScad({
      inputFile: 'test/scads/example.scad',
      outputFile: 'test/tempytemp/aa/output.json',
      objectOutputFile: 'test/tempytemp/bb/object-output.stl',
      createDirs: true,
    });

    // there should be one file in aa
    const diraContents = await fs.readdir('./test/tempytemp/aa');
    assert.deepStrictEqual(diraContents, ['output.json']);
    
    // and there should be one file in bb
    const dirbContents = await fs.readdir('./test/tempytemp/bb');
    assert.deepStrictEqual(dirbContents, ['object-output.stl']);
  });

  test.skip('scad injection should work', async () => {

    await runScad({
      inputFile: 'test/scads/example.scad',
      outputFile: 'test/tempytemp/scad-output.json',
      objectOutputFile: 'test/tempytemp/scad-object-output.stl',
      scadInjection: 'sploof = 93836;',
    });

    // read the generated json file. sploof should be 93836
    const data = require('./tempytemp/scad-output.json');
    assert.strictEqual(data.sploof, 93836);
  });

  test.skip('custom record tag', async () => {

    await runScad({
      inputFile: 'test/scads/example2.scad',
      outputFile: 'test/tempytemp/ex2-output.json',
      objectOutputFile: 'test/tempytemp/ex2-oo.stl',
      recordTag: 'REC',
    });

    const data = require('./tempytemp/ex2-output.json');
    const expectedData = {
      abcd: 'efgh',
      a: {b: {c: {d: 23}}},
    };
    assert.deepStrictEqual(data, expectedData);
  });


});

