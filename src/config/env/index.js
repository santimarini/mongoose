const _ = require('lodash');
const path = require('path');

// if not chosen NODE_ENV, set dev environment as default
if (!process.env.NODE_ENV) { process.env.NODE_ENV = 'dev'; }
const env = process.env.NODE_ENV;
module.exports = _.merge(
  require(path.join(__dirname,
    '/dev.js')),
  require(path.join(__dirname,
    `/${env.trim()}.js`)) || {}
);
