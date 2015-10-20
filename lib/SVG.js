'use strict';

const filterNode = require('./filterNode');
const Viewbox = require('./Viewbox');
const xml2js = require('xml2js');

const NS = 'http://www.w3.org/2000/svg';

const IGNORE_NODES = [
  '$',
  'title',
  'desc',
  'style',
];

const IGNORE_ATTRS = [
  'x',
  'y',
  'style',
];

function sanitize(node) {
  if (typeof node !== 'object') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(sanitize);
  }
  let sanitized = {};
  for (let attr in node) {
    let nsIndex = attr.indexOf(':');
    if (nsIndex > -1) {
      let namespace = attr.substr(0, nsIndex);
      if (namespace !== 'xml' && namespace !== 'xlink') {
        continue;
      }
    }
    if (IGNORE_ATTRS.indexOf(attr) > -1) {
      continue;
    }
    sanitized[attr] = sanitize(node[attr]);
  }
  return sanitized;
}

class SVG {
  constructor(id, json) {
    this.id = id;
    this.xmlns = NS;
    this.style = {};
    this.data = {};
    if (json) {
      if (!json.svg) {
        throw new Error('Cannot generate an SVG object from an invalid source.');
      }
      var sanitized = sanitize(json.svg);
      let attrs = sanitized.$;
      this.xmlns = attrs.xmlns || this.xmlns;
      this.viewBox = new Viewbox(attrs.viewBox);
      for (let k in sanitized) {
        if (IGNORE_NODES.indexOf(k) > -1) {
          continue;
        }
        if (sanitized[k].length === 0) {
          continue;
        }
        if (sanitized[k].length === 1 && sanitized[k][0].length === 0) {
          continue;
        }
        this.data[k] = sanitized[k];
      }
    }
  }

  filter(options) {
    let filtered = {};
    for (let attr in this.data) {
      filtered[attr] = filterNode(attr, this.data[attr], options);
    }
    this.data = filtered;
    return this;
  }

  getStyles() {
    let keys = Object.keys(this.style);
    if (!keys.length) {
      return '';
    }
    return keys.map((key) => key + ':' + this.style[key]).join(';');
  }

  toJSON() {
    let svg = {
      $: {
        id: this.id,
        xmlns: this.xmlns,
        style: this.getStyles(),
      }
    };
    if (this.viewBox) {
      svg.$.viewBox = this.viewBox.toString();
    }
    for (let node in this.data) {
      svg[node] = this.data[node];
    }
    return { svg };
  }

  toString() {
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(this.toJSON());
    return xml;
  }

  addNode(node, value) {
    if (this.data[node]) {
      if (Array.isArray(this.data[node])) {
        this.data[node].push(value);
      } else {
        this.data[node] = [this.data[node], value];
      }
    } else {
      this.data[node] = value;
    }
  }
}

module.exports = SVG;
