const validation = require('../validation');
const read = require('../utils/readConfig');
const lexicon = require('../lexicon/lexiconStats');
const { Menu } = require('electron');

// Canonical entry point for opening a LexaDB in a window.
// Called both from menu actions and IPC (new instance auto-load).
async function openLexadb(win, lexadbPath) {
  const validated = await validation.validateLexadb(lexadbPath);
  const validatedLexicon = await validation.validateLexicon(lexadbPath);
  const config = read.readConfig(lexadbPath);
  const lexiconSummary = await lexicon.lexiconSummarise(lexadbPath);
  const lexiconCounts = await lexicon.lexiconCount(lexadbPath);

  win.webContents.send('lexadb-name', config.name);
  win.webContents.send('lexadb-author', config.author);
  win.webContents.send('lexadb-opened', lexadbPath);
  win.webContents.send('lexadb-validation', validated);
  win.webContents.send('lexicon-validation', validatedLexicon);
  win.webContents.send('lexicon-summary', lexiconSummary);
  win.webContents.send('lexicon-counts', lexiconCounts);

  const item = Menu.getApplicationMenu()?.getMenuItemById('write-merged');
  if (item) item.enabled = true;
}

module.exports = { openLexadb };
