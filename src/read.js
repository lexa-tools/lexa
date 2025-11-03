/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const path = require('node:path');
const fs = require('fs');
const yaml = require('yaml');

// Read config.yaml from path
function readConfig(lexadbPath) {
  const config = yaml.parse(fs.readFileSync(path.join(lexadbPath, 'config.yaml'), 'utf8'));

  return config;
}

module.exports = { readConfig };