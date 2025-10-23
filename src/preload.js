// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onLexadbOpened: (callback) => ipcRenderer.on('lexadb-opened', (event, lexadbPath) => callback(lexadbPath)),
  onLexadbValidation: (callback) => ipcRenderer.on('lexadb-validation', (event, validation) => callback(validation))
});