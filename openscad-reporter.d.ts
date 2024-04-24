

declare module 'openscad-reporter' {

  export type ScadConfig = {
    inputFile: string,
    jsonOutputFile?: string,
    outputFile?: string,
    scadInjection?: string,
    recordTag?: string,
    isQuiet?: boolean,
  };

  export type ScadSummary = {
    geometriesNum: number,
    geometriesCacheSizeBytes: number,
    cgalPolyhedronsNum: number,
    cgalCacheSizeBytes: number,
    isSimple: boolean,
    numVertices: number,
    numHalfedges: number,
    numEdges: number,
    numHalffacets: number,
    numFacets: number,
    numVolumes: number,
  };
  
  export type ScadRes = {
    data: object,
    summary: ScadSummary,
    echoLines: string[],
    recorderLines: string[],
    openscadLines: string[],
    warningLines: string[],
  };
  
  export async function runScad(config: ScadConfig): ScadRes;
}