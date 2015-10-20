'use strict';

module.exports = function filterNode(type, children, options) {
  if (Array.isArray(children)) {
    return children.map((c) => {
      return filterNode(type, c, options);
    });
  }

  if (typeof children === 'object') {
    let copy = {};
    for (let attr in children) {
      if (type === '$') {
        if (options.removeIds && attr === 'id') {
          continue;
        }
        if (options.noFill && attr === 'fill') {
          continue;
        }
      }
      copy[attr] = filterNode(attr, children[attr], options);
    }
    return copy;
  }

  return children;
};
