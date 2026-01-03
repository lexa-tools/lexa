/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { BrowserWindow } = require('electron');
const path = require('path');

function createWindow(dbPath = null) {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    backgroundColor: '#fafafa',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Pass the database path as a query parameter to the renderer
  win.loadFile(path.join(__dirname, '../ui/index.html'), {
    query: dbPath ? { db: dbPath } : undefined,
  });

  return win;
}

module.exports = { createWindow };
