# openscad-reporter
A wrapper script for OpenScad allowing for the export of parameters from OpenScad to a JSON file 

*Note: Openscad must be installed on the computer*

The reporter can be installed globally and used as a script (provides a bin), or be imported into a js module.

## the problem

Say you have a scad file `hoogie.scad` with the following contents
```scad
hoogieColor = "#123456";
echo("__RECORD", "colors.hoogieColor", hoogieColor);
```

If the scadfile above is then run with openscad-reporter, a json file will be generated with the contents
```json
{
  "colors": {
    "hoogieColor": "#123456"
  }
}
```


## to install and use globally

```
yarn global add openscad-reporter
```
or

```
npm install -global openscad-reporter
```
make sure to have the appropriate bin folder on the `$PATH`.

This adds a `runscad` command which can then be used in e.g. a project folder with a hoogie.scad file

```
$ runscad hoogie.scad
```

This is the simplest usage case, and will add a `hoogie.json` and `hoogie.stl` file in the same folder as the scad file.

## to install and use in a module

```
yarn add openscad-reporter
```
or

```
npm install openscad-reporter
```

and then use in a module
```js
import { runscad } from 'openscad-reporter'

config: {
  inputFile: 'scads/hoogie.scad',
};
await runscad(config);
```

## options

The options available to the config file (and also when using the cli version) are:

- `inputFile` (required - path to the scad file to be run)
- `jsonOutputFile` (optional - path to generated json file. Defaults to inputfile except `json ` extension)
- `outputFile` (optional - path to generated object file. Defaults to inputfile except `stl ` extension)
- `scadInjection` (optional - string containing scad code that gets prepended to the targeted scad file. Is piped as-is to Oopenscad with the `-D` option)
- `recordTag` (optional - string that is used to identify which `echo` statements has data to be exported. Defaults to `"__RECORD"`)
- `quiet` (optional - boolean that makes the openscad-reporter run quietly .. ish)

## cli 

When using the cli version the corresponding options available are

- `--jsonoutput` or `-j`
- `--output` or `-o` 
- `--inject` or `-i`
- `--record` or `-r`
- `--quiet` or `-q`

so that a valid command using all the options would be
```sh
runscad -o "models/hoogie.stl" -j "data/hoogie.json" -i 'hoogieColor = "#654321";' -r "REC" hoogie.scad
```
which will generate the folders for the stl and json file if not previously present.