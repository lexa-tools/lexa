/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('yaml');
const { ipcMain } = require('electron');
const { sortEntries } = require('./sortEntries');

ipcMain.handle('read-lexicon', async (event, lexadbPath) => {
  const files = glob.sync(path.join(lexadbPath, 'lexicon', '*.yaml'));
  const lexemes = [];
  let sorting = null;
  const configPath = path.join(lexadbPath, 'config.yaml');

  if (fs.existsSync(configPath)) {
    try {
      sorting = yaml.parse(fs.readFileSync(configPath, 'utf8'))?.sorting ?? null;
    } catch (err) {
      console.error('Error parsing config.yaml:', err.message);
    }
  }

  for (const file of files) {
    try {
      const data = yaml.parse(fs.readFileSync(file, 'utf8'));
      if (data?.lexeme) lexemes.push({ lexeme: data.lexeme, content: data });
    } catch (err) {
      console.error(`Error parsing ${file}:`, err.message);
    }
  }

  lexemes.sort((a, b) => sortEntries(sorting)(a.lexeme, b.lexeme));
  return lexemes;
});
