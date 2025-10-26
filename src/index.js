/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs');
const yaml = require('yaml');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    backgroundColor: '#fafafa',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
 const template = [
    ...(process.platform === 'darwin'
      ? [{ role: 'appMenu' }]
      : []),
    {
      role: 'fileMenu',
      submenu: [
        {
          label: 'Open Project…',
          accelerator: 'CmdOrCtrl+O',
          click: openLexadb,
        },
        { type: 'separator' },
        { role: 'close' },
      ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: []
    }
  ]

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function openLexadb() {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const lexadbPath = result.filePaths[0];

    const validation = validateLexadb(lexadbPath);

    const config = readConfig(lexadbPath);
    const lexadbName = config.name;

    mainWindow.webContents.send('lexadb-name', lexadbName);
    mainWindow.webContents.send('lexadb-opened', lexadbPath);
    mainWindow.webContents.send('lexadb-validation', validation);
  }
}

const expectedStructure = [
  'lexicon',
  'collections',
  'config.yaml',
  'grammar.yaml'
];

function validateLexadb(lexadbPath) {
  try {
    const entries = fs.readdirSync(lexadbPath);
    const missing = expectedStructure.filter(item => !entries.includes(item));

    const config = readConfig(lexadbPath);

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

function readConfig(lexadbPath) {
  const config = yaml.parse(fs.readFileSync(path.join(lexadbPath, 'config.yaml'), 'utf8'));

  return config;
}