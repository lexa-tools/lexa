/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const path = require('node:path');
const fs = require('fs');
const yaml = require('yaml');
const glob = require('glob');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const read = require('../utils/read');

const expectedStructure = [
  'lexicon',
  'collections',
  'config.yaml',
  'morphology.yaml'
];

async function validateLexadb(lexadbPath) {
  try {
    const entries = fs.readdirSync(lexadbPath);
    const missing = expectedStructure.filter(item => !entries.includes(item));

    const config = read.readConfig(lexadbPath);

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

// Initialize AJV with loadSchema for resolving $refs
const ajv = new Ajv({ allErrors: true, strict: false, loadSchema: async (uri) => {
    // Resolve the $ref relative to the folder containing the main schema
    const refPath = path.resolve(path.dirname(schemaPath), uri);
    if (!fs.existsSync(refPath)) {
        throw new Error(`Referenced schema not found: ${refPath}`);
    }
    const data = fs.readFileSync(refPath, 'utf8');
    return JSON.parse(data);
}});

addFormats(ajv);

const lexiconSchemaPath = path.join(__dirname, '../assets', 'schemas', 'lx-schema.json');
const lexiconSchema = JSON.parse(fs.readFileSync(lexiconSchemaPath, 'utf8'));

async function validateLexicon(lexadbPath) {
    let count = 0

    try {
    const validate = await ajv.compileAsync(lexiconSchema);
    const files = glob.sync(path.join(lexadbPath, 'lexicon', '*.yaml'));

    // Validate each YAML file
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext !== '.yaml' && ext !== '.yml') continue;

      const data = yaml.parse(fs.readFileSync(file, 'utf8'));
      const valid = validate(data);

      if (valid) {
        console.log(`${file}: valid`);
      } else {
        count = count + 1;
        console.log(`${file}: invalid`);
        console.log(validate.errors);
        hasError = true;
      }
    }
  } catch (err) {
    console.log(err.message)
  }

  return { valid: count === 0 };
}

module.exports = { validateLexadb, validateLexicon};