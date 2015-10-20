'use strict';

const IO = require('./IO');
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
        data = data.map((d) => d.filter(this.filterOptions));
      }
      let sprited = sprite(data);
      if (path) {
        return IO.writeSVG(sprited, path);
      }
      return new Promise((resolve) => {
        resolve(sprited.toString())
      });
    });
  }
}

function prep(files) {
  return new Chain(files);
}

module.exports = prep;
