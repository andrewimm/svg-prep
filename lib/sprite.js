'use strict';

const SVG = require('./SVG');
const Viewbox = require('./Viewbox');

module.exports = function sprite(svgs, options) {
  options = options || {};
  if (!Array.isArray(svgs)) {
    svgs = [svgs];
  }
  let max = 0;
  let cursor = 0;
  let wrapper = new SVG(options.id || 'sprites');
  wrapper.style.display = 'none';
  svgs.forEach((svg) => {
    max = Math.max(max, svg.viewBox.height);
    let values = {};
    for (let attr in svg.data) {
      values[attr] = svg.data[attr];
    }
    values.$ = values.$ || {};
    values.$.id = svg.id;
    values.$.viewBox = svg.viewBox.toString();
    wrapper.addNode('symbol', values);
  });
  return wrapper;
};