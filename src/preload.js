/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onLexadbName: (callback) => ipcRenderer.on('lexadb-name', (event, lexadbName) => callback(lexadbName)),
  onLexadbAuthor: (callback) => ipcRenderer.on('lexadb-author', (event, lexadbAuthor) => callback(lexadbAuthor)),
  onLexadbOpened: (callback) => ipcRenderer.on('lexadb-opened', (event, lexadbPath) => callback(lexadbPath)),
  onLexadbValidation: (callback) => ipcRenderer.on('lexadb-validation', (event, validated) => callback(validated)),
  onLexiconValidation: (callback) => ipcRenderer.on('lexicon-validation', (event, validatedLexicon) => callback(validatedLexicon)),
  onLexiconSummary: (callback) => ipcRenderer.on('lexicon-summary', (event, lexiconSummary) => callback(lexiconSummary)),
  onLexiconCounts: (callback) => ipcRenderer.on('lexicon-counts', (event, lexiconCounts) => callback(lexiconCounts)),

  readLexicon: (lexadbPath) => ipcRenderer.invoke('read-lexicon', lexadbPath)
});