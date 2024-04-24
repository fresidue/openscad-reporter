

declare module 'openscad-reporter' {
  export function runScad({
    inputFile,
    jsonOutputFile,
    outputFile,
    scadInjection,
    recordTag,
    isQuiet,
  }: {
    inputFile: string,
    jsonOutputFile?: string,
    outputFile?: string,
    scadInjection?: string,
    recordTag?: string,
    isQuiet?: boolean,
  }): void;
}