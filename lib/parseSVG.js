'use strict';

const SVG = require('./SVG');
const xml2js = require('xml2js');

module.exports = function parseSVG(raw, id) {
  if (Buffer.isBuffer(raw)) {
    raw = raw.toString();
  }
  return new Promise((resolve, reject) => {
    xml2js.parseString(raw, (err, result) => {
      if (err) {
        return reject(err);
      }
      let svg = new SVG(id, result);
      resolve(svg);
    });
  });
}
