// Gruntfile.js

let section = 'app';
if (process.env.section) {
  section = process.env.section;
}

// eslint-disable-next-line global-require
const gruntConfig = require(`./Gruntfile.${section}.js`);
module.exports = gruntConfig;
