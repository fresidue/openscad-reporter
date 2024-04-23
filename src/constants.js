
import path from 'path';


export const ECHO_TAG = 'ECHO: ';
export const DEFAULT_RECORD_TAG = '__RECORD';

const OUTPUT_EXTENSIONS = {
  stl: 'stl', 
  asciistl: 'asciistl', 
  binstl: 'binstl',
  off: 'off',
  wrl: 'wrl',
  amf: 'amf', 
  '3mf': '3mf',
  csg: 'csg',
  dxf: 'dxf',
  svg: 'svg',
  pdf: 'pdf',
  png: 'png',
  echo: 'echo',
  ast: 'ast',
  term: 'term',
  nef3: 'nef3',
  nefdbg: 'nefdbg',
};
export const DEFAULT_OUTPUT_EXTENSION = OUTPUT_EXTENSIONS.stl;

export const ORDERED_OUTPUT_EXTENSIONS = [
  OUTPUT_EXTENSIONS.stl, 
  OUTPUT_EXTENSIONS.asciistl, 
  OUTPUT_EXTENSIONS.binstl,
  OUTPUT_EXTENSIONS.off,
  OUTPUT_EXTENSIONS.wrl,
  OUTPUT_EXTENSIONS.amf, 
  OUTPUT_EXTENSIONS['3mf'],
  OUTPUT_EXTENSIONS.csg,
  OUTPUT_EXTENSIONS.dxf,
  OUTPUT_EXTENSIONS.svg,
  OUTPUT_EXTENSIONS.pdf,
  OUTPUT_EXTENSIONS.png,
  OUTPUT_EXTENSIONS.echo,
  OUTPUT_EXTENSIONS.ast,
  OUTPUT_EXTENSIONS.term,
  OUTPUT_EXTENSIONS.nef3,
  OUTPUT_EXTENSIONS.nefdbg,
];



