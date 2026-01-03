/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { app, BrowserWindow, ipcMain } = require('electron');
const { createWindow } = require('./window');
const { setupMenu } = require('./menu');
const { openLexadb } = require('./db/openLexadb');

// Import IPC handlers
require('./lexicon/readLexicon');

// Quit on squirrel events
if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {
  setupMenu();

  const dbPath = process.argv[2];
  createWindow(dbPath);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('open-lexadb', async (event, lexadbPath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  await openLexadb(win, lexadbPath);
});