/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs');
const yaml = require('yaml');

const expectedStructure = [
  'lexicon',
  'collections',
  'config.yaml',
  'grammar.yaml'
];

function validateLexadb(lexadbPath) {
  try {
    const entries = fs.readdirSync(lexadbPath);
    const missing = expectedStructure.filter(item => !entries.includes(item));

    const config = readConfig(lexadbPath);

    if (missing.length === 0 && config.schema === 'lexadb') {
      return { valid: true };
    } else {
      console.log(missing)
      return { valid: false, missing };
    }
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

function readConfig(lexadbPath) {
  const config = yaml.parse(fs.readFileSync(path.join(lexadbPath, 'config.yaml'), 'utf8'));

  return config;
}

module.exports = { validateLexadb, readConfig};