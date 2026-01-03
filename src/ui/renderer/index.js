/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

import { registerIpcHandlers } from './ipcHandlers.js'
import { renderView, loadOverview } from './views.js'
import { renderLexicon } from './lexiconView.js'

const lexiconData = []

const viewMap = {
  "view-overview": "overview.html",
  "view-lexicon": "lexicon.html"
}

window.addEventListener('DOMContentLoaded', () => {
  registerIpcHandlers(lexiconData);

  const params = new URLSearchParams(window.location.search);
  const dbPath = params.get('db');

  if (dbPath) {
    window.electronAPI.openLexadb(dbPath);
  }
});

renderView(viewMap, (activeView) => {
  if (activeView === 'view-lexicon') {
    const sheetLexicon = document.querySelector('.sheet-lexicon')
    const sidePanel = document.querySelector('.side-panel')
    renderLexicon(sheetLexicon, sidePanel, lexiconData)
  }
})

loadOverview(viewMap)
