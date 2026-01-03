/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { Menu, dialog, BrowserWindow } = require('electron');
const { execFile } = require('child_process');
const path = require('path');
const { openLexadb } = require('./db/openLexadb');
const { writeMerged } = require('./utils/writeMerged');

function setupMenu() {
  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    {
      role: 'fileMenu',
      submenu: [
{
  label: 'Open Project…',
  accelerator: 'CmdOrCtrl+O',
  click: async () => {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) return;

    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) return;

    await openLexadb(win, result.filePaths[0]);
  }
},
{
  label: 'Open Database in New Instance',
  click: async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (canceled || filePaths.length === 0) return;

    const lexadbPath = filePaths[0];

    // Path to your main JS file
    const mainPath = path.join(__dirname, 'index.js');

    execFile(process.execPath, [mainPath, lexadbPath], (err) => {
      if (err) console.error('Failed to open new instance:', err);
    });
  }
},
        { id: 'write-merged', label: 'Write merged lexicon...', enabled: false, click: writeMerged },
        { type: 'separator' },
        { role: 'close' },
      ],
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    { role: 'help', submenu: [] },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = { setupMenu };
