/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const yaml = require('yaml');
const glob = require('glob');
const validation = require('./validation');
const read = require('./read');
const lexicon = require('./lexicon')

let currentLexadbPath = null;

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
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

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
        {
          id: 'write-merged',
          label: 'Write merged lexicon...',
          enabled: false,
          click: writeMerged,
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
    currentLexadbPath = lexadbPath;

    const validated = await validation.validateLexadb(lexadbPath);
    const validatedLexicon = await validation.validateLexicon(lexadbPath);

    const config = read.readConfig(lexadbPath);
    const lexadbName = config.name;
    const lexadbAuthor = config.author;
    const lexiconSummary = await lexicon.lexiconSummarise(lexadbPath);
    const lexiconCounts = await lexicon.lexiconCount(lexadbPath);

    mainWindow.webContents.send('lexadb-name', lexadbName);
    mainWindow.webContents.send('lexadb-author', lexadbAuthor);
    mainWindow.webContents.send('lexadb-opened', lexadbPath);
    mainWindow.webContents.send('lexadb-validation', validated);
    mainWindow.webContents.send('lexicon-validation', validatedLexicon);
    mainWindow.webContents.send('lexicon-summary', lexiconSummary);
    mainWindow.webContents.send('lexicon-counts', lexiconCounts);

    // Make write-merged clickable
    const menu = Menu.getApplicationMenu();
    const item = menu.getMenuItemById('write-merged');
    item.enabled = true;
  }
}

  async function ensureFolder(folderPath) {
    try {
      // mkdir with { recursive: true } will create the folder if it doesn't exist
      // and do nothing if it already exists
      await fs.promises.mkdir(folderPath, { recursive: true });
    } catch (err) {
      console.error(`Failed to create folder ${folderPath}:`, err);
      throw err;
    }
  }

async function writeMerged() {
  if (!currentLexadbPath) return;

  const lexiconDir = path.join(currentLexadbPath, 'lexicon');

  const files = await fs.promises.readdir(lexiconDir);
  const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

  const merged = {};

  for (const file of yamlFiles) {
    const fullPath = path.join(lexiconDir, file);
    const content = await fs.promises.readFile(fullPath, 'utf8');
    const obj = yaml.parse(content);

    if (!obj || !obj.id) {
      throw new Error(`Missing ID in ${file}`);
    }

    if (merged[obj.id]) {
      throw new Error(`Duplicate ID: ${obj.id}`);
    }

    merged[obj.id] = obj;
  }

  // const { canceled, filePath } = await dialog.showSaveDialog({
  //   title: 'Write merged lexicon',
  //   defaultPath: 'lexicon.yaml',
  //   filters: [{ name: 'YAML', extensions: ['yaml', 'yml'] }]
  // });

  // if (canceled || !filePath) return;

  await ensureFolder(path.join(currentLexadbPath, 'src'));
  const filePath = path.join(currentLexadbPath, 'src/lexicon.yaml');
  const output = yaml.stringify(merged);
  await fs.promises.writeFile(filePath, output, 'utf8');
}

// Sorting

function sortEntries(sorted) {
  if (!Array.isArray(sorted) || sorted.length === 0) {
    return (a, b) => a.localeCompare(b)
  }

  const ordered = [...sorted].sort((a, b) => b.length - a.length)
  const rank = new Map(sorted.map((c, i) => [c, i]))

  function tokenize(str) {
    const out = []
    let i = 0

    while (i < str.length) {
      let matched = false

      for (const sym of ordered) {
        if (str.startsWith(sym, i)) {
          out.push(sym)
          i += sym.length
          matched = true
          break
        }
      }

      if (!matched) {
        out.push(str[i])
        i++
      }
    }

    return out
  }

  return (a, b) => {
    const ta = tokenize(a)
    const tb = tokenize(b)
    const n = Math.min(ta.length, tb.length)

    for (let i = 0; i < n; i++) {
      if (ta[i] === tb[i]) continue

      const ra = rank.has(ta[i]) ? rank.get(ta[i]) : Infinity
      const rb = rank.has(tb[i]) ? rank.get(tb[i]) : Infinity

      if (ra !== rb) return ra - rb
      return ta[i].localeCompare(tb[i])
    }

    return ta.length - tb.length
  }
}


// Read lexicon

ipcMain.handle('read-lexicon', async (event, lexadbPath) => {
  const files = glob.sync(path.join(lexadbPath, 'lexicon', '*.yaml'))
  const lexemes = []

  // optional config.yaml
  let sorting = null
  const configPath = path.join(lexadbPath, 'config.yaml')

  if (fs.existsSync(configPath)) {
    try {
      const config = yaml.parse(fs.readFileSync(configPath, 'utf8'))
      sorting = config?.sorting ?? null
      console.log(sorting)
    } catch (err) {
      console.error('Error parsing config.yaml:', err.message)
    }
  }

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      const data = yaml.parse(content)
      if (data?.lexeme) {
        lexemes.push({ lexeme: data.lexeme, content: data })
      }
    } catch (err) {
      console.error(`Error parsing ${file}:`, err.message)
    }
  }

  const comparator = sortEntries(sorting)
  lexemes.sort((a, b) => comparator(a.lexeme, b.lexeme))

  return lexemes
})
