'use strict';

const fs = require('fs');
const parseSVG = require('./parseSVG');
const path = require('path');
const SVG = require('./SVG');
const xml2js = require('xml2js');

exports.readSVG = function readSVG(filepath) {
  if (Array.isArray(filepath)) {
    return Promise.all(
      filepath.map((file) => readSVG(file))
    );
  }
  if (arguments.length > 1) {
    return readSVG(Array.prototype.slice.call(arguments));
  }

  let filename = path.basename(filepath, '.svg');
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  }).then((data) => {
    return parseSVG(data, filename);
  });
}

exports.writeSVG = function writeSVG(svg, filename) {
  return new Promise((resolve, reject) => {
    if (!(svg instanceof SVG)) {
      return reject('Cannot generate output from a non-SVG object.');
    }
    fs.writeFile(filename, svg.toString(), (err) => {
      if (err) {
        reject(err);
      }
      resolve(filename);
    });
  });
}