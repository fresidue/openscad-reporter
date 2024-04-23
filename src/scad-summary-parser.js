

import _ from 'lodash';



const SUMMARY_KEYS = {
  GEOMETRIES_NUM: 'Geometries in cache:',
  GEOMETRIES_CACHE_SIZE_BYTES: 'Geometry cache size in bytes:',
  CGAL_POLYHEDRONS_NUM: 'CGAL Polyhedrons in cache:',
  CGAL_CACHE_SIZE_BYTES: 'CGAL cache size in bytes:',
  IS_SIMPLE: 'Simple:',
  NUM_VERTICES: 'Vertices:',
  NUM_HALFEDGES: 'Halfedges:',
  NUM_EDGES: 'Edges:',
  NUM_HALFFACETS: 'Halffacets:',
  NUM_FACETS: 'Facets:',
  NUM_VOLUMES: 'Volumes:',
};

const parseIntegerLine = (line) => {
  if (!line) {
    return 0;
  }
  const numStr = _.split(line, ':')[1];
  const num = _.toSafeInteger(numStr);
  return num;
};

const parseBooleanLine = (line) => {
  if (!line) {
    return 0;
  }
  const boolStr = _.trim(_.split(line, ':')[1]);
  const boolVal = boolStr === 'yes' ? true : false;
  return boolVal;
};

export const parseSummary = (summaryLines) => {
  const filteredLines = _.filter(summaryLines, (line) => _.size(line));
  const lines = _.map(filteredLines, line => _.trim(line));
  
  const geometriesNum = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.GEOMETRIES_NUM)));
  const geometriesCacheSizeBytes = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.GEOMETRIES_CACHE_SIZE_BYTES)));
  const cgalPolyhedronsNum = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.CGAL_POLYHEDRONS_NUM)));
  const cgalCacheSizeBytes = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.CGAL_CACHE_SIZE_BYTES)));
  const isSimple = parseBooleanLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.IS_SIMPLE)));
  const numVertices = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.NUM_VERTICES)));
  const numHalfedges = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.NUM_HALFEDGES)));
  const numEdges = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.NUM_EDGES)));
  const numHalffacets = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.NUM_HALFFACETS)));
  const numFacets = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.NUM_FACETS)));
  const numVolumes = parseIntegerLine(_.find(lines, line => _.startsWith(line, SUMMARY_KEYS.NUM_VOLUMES)));

  const summary = {
    geometriesNum,
    geometriesCacheSizeBytes,
    cgalPolyhedronsNum,
    cgalCacheSizeBytes,
    isSimple,
    numVertices,
    numHalfedges,
    numEdges,
    numHalffacets,
    numFacets,
    numVolumes,
  };
  return summary;
};
