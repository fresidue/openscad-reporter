

import assert from 'assert';
import { describe, test } from 'vitest';

import { parseSummary } from '../src/scad-summary-parser';


describe('parse-summary.test ()', () => {

  test('simple test', () => {
    const summaryLines = [
      '',
      '',
      '',
      '',
      '',
      'Geometries in cache: 8',
      'Geometry cache size in bytes: 15040',
      'CGAL Polyhedrons in cache: 8',
      'CGAL cache size in bytes: 648512',
      'Total rendering time: 0:00:00.195',
      '   Top level object is a 3D object:',
      '   Simple:        yes',
      '   Vertices:       90',
      '   Halfedges:     278',
      '   Edges:         139',
      '   Halffacets:     98',
      '   Facets:         49',
      '   Volumes:         2',
      ''
    ];
    const summary = parseSummary(summaryLines);
    const expected = {
      geometriesNum: 8,
      geometriesCacheSizeBytes: 15040,
      cgalPolyhedronsNum: 8,
      cgalCacheSizeBytes: 648512,
      isSimple: true,
      numVertices: 90,
      numHalfedges: 278,
      numEdges: 139,
      numHalffacets: 98,
      numFacets: 49,
      numVolumes: 2
    };  
    assert.deepStrictEqual(summary, expected);
  });
});
