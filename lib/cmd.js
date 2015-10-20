'use strict';

const IO = require('./IO');
const program = require('commander');
const pkg = require('../package.json');
const sprite = require('./sprite');

program
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('--consolidate', 'Consolidate group tags')
  .option('--removeIds', 'Remove Ids of nested nodes')
  .option('-o, --output [filename]', 'Name of the output file [sprites.svg]', 'sprites.svg')
  .parse(process.argv);

if (!process.argv.slice(2).length || !program.args.length) {
  program.help();
}

let options = {
  consolidate: !!program.consolidate,
  removeIds: !!program.removeIds
};

IO.readSVG(program.args).then((data) => {
  let filtered = data.map(filterNode, options);
  let sprited = sprite(data);
  return IO.writeSVG(sprited, program.output);
}).then((filename) => {
  console.log('Written to ' + filename);
}, (err) => {
  let stack = err.stack.split('\n');
  stack.forEach((line) => console.log(line));
});
