/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { dialog, Menu } = require('electron');
const validation = require('../validation');
const read = require('../utils/read');
const lexicon = require('./lexiconStats');
const { getMainWindow } = require('../window');

let currentLexadbPath = null;

async function openLexadb() {
  const mainWindow = getMainWindow();
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled || result.filePaths.length === 0) return;

  const lexadbPath = result.filePaths[0];
  currentLexadbPath = lexadbPath;

  const validated = await validation.validateLexadb(lexadbPath);
  const validatedLexicon = await validation.validateLexicon(lexadbPath);
  const config = read.readConfig(lexadbPath);
  const lexiconSummary = await lexicon.lexiconSummarise(lexadbPath);
  const lexiconCounts = await lexicon.lexiconCount(lexadbPath);

  mainWindow.webContents.send('lexadb-name', config.name);
  mainWindow.webContents.send('lexadb-author', config.author);
  mainWindow.webContents.send('lexadb-opened', lexadbPath);
  mainWindow.webContents.send('lexadb-validation', validated);
  mainWindow.webContents.send('lexicon-validation', validatedLexicon);
  mainWindow.webContents.send('lexicon-summary', lexiconSummary);
  mainWindow.webContents.send('lexicon-counts', lexiconCounts);

  const item = Menu.getApplicationMenu().getMenuItemById('write-merged');
  if (item) item.enabled = true;
}

module.exports = { openLexadb, currentLexadbPath };
