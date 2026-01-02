/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { app, BrowserWindow } = require('electron');
const { createWindow } = require('./window');
const { setupMenu } = require('./menu');

// Import IPC handlers
require('./lexicon/readLexicon');

// Quit on squirrel events
if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(() => {
  setupMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
