/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { Menu } = require('electron');
const { openLexadb } = require('./db/openLexadb');
const { writeMerged } = require('./utils/writeMerged');

function setupMenu() {
  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    {
      role: 'fileMenu',
      submenu: [
        { label: 'Open Project…', accelerator: 'CmdOrCtrl+O', click: openLexadb },
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
