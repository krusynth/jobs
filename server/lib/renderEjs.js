'use strict';

const ejs = require('ejs');

function renderEjs(file, data, options) {
  return new Promise( (resolve, reject) => {
    ejs.renderFile(file, data, options, (err, str) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(str);
      }
    });
  });
}

module.exports = renderEjs;
