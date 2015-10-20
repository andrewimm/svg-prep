'use strict';

const IO = require('./IO');
const filterNode = require('./filterNode');
const sprite = require('./sprite');

function Chain(files) {
  this.files = files;
}
Chain.prototype = {
  filter(options) {
    this.filterOptions = options || {};
    return this;
  },
  output(path) {
    return IO.readSVG(this.files).then((data) => {
      if (this.filterOptions) {
        data = data.map(filterNode, this.filterOptions);
      }
      let sprited = sprite(data);
      return IO.writeSVG(sprited, path);
    });
  }
}

function prep(files) {
  return new Chain(files);
}

module.exports = prep;
