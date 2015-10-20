'use strict';

class Viewbox {
  constructor(a, b, c, d) {
    var pieces = [a, b, c, d];
    if (typeof a === 'string' && arguments.length !== 4) {
      pieces = a.split(/\s+/).map((str) => parseFloat(str));
    }
    if (pieces.length !== 4) {
      throw new Error('Invalid viewBox attribute value.');
    }
    this.minX = pieces[0]
    this.minY = pieces[1];
    this.width = pieces[2];
    this.height = pieces[3];
    this.maxX = this.minX + this.width;
    this.maxY = this.minY + this.height;
  }

  toString() {
    return [this.minX, this.minY, this.width, this.height].join(' ');
  }
}

module.exports = Viewbox;