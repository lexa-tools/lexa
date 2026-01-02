/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { ensureFolder } = require('./ensureFolder');
const { currentLexadbPath } = require('../db/openLexadb');

async function writeMerged() {
  if (!currentLexadbPath) return;
  const lexiconDir = path.join(currentLexadbPath, 'lexicon');
  const files = await fs.promises.readdir(lexiconDir);
  const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  const merged = {};

  for (const file of yamlFiles) {
    const content = await fs.promises.readFile(path.join(lexiconDir, file), 'utf8');
    const obj = yaml.parse(content);
    if (!obj?.id) throw new Error(`Missing ID in ${file}`);
    if (merged[obj.id]) throw new Error(`Duplicate ID: ${obj.id}`);
    merged[obj.id] = obj;
  }

  await ensureFolder(path.join(currentLexadbPath, 'src'));
  const filePath = path.join(currentLexadbPath, 'src/lexicon.yaml');
  await fs.promises.writeFile(filePath, yaml.stringify(merged), 'utf8');
}

module.exports = { writeMerged };
