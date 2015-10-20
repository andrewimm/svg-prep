'use strict';

const prep = require('./prep');
const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('--consolidate', 'Consolidate group tags')
  .option('--removeIds', 'Remove Ids of nested nodes')
  .option('--noFill', 'Remove fill attributes on all nodes')
  .option('-o, --output [filename]', 'Name of the output file [sprites.svg]', 'sprites.svg')
  .parse(process.argv);

if (!process.argv.slice(2).length || !program.args.length) {
  program.help();
}

let options = {
  consolidate: !!program.consolidate,
  removeIds: !!program.removeIds,
  noFill: !!program.noFill,
};

prep(program.args).filter(options).output(program.output).then((filename) => {
  console.log('Written to ' + filename);
}, (err) => {
  let stack = err.stack.split('\n');
  stack.forEach((line) => console.log(line));
});
