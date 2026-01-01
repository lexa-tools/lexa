/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

import { registerIpcHandlers } from './ipcHandlers.js'
import { setupSidebar, loadOverview } from './views.js'
import { renderLexicon } from './lexiconView.js'

const lexiconData = []

const viewMap = {
  "view-overview": "overview.html",
  "view-lexicon": "lexicon.html"
}

registerIpcHandlers(lexiconData)

setupSidebar(viewMap, (activeView) => {
  if (activeView === 'view-lexicon') {
    const sheetLexicon = document.querySelector('.sheet-lexicon')
    const sidePanel = document.querySelector('.side-panel')
    renderLexicon(sheetLexicon, sidePanel, lexiconData)
  }
})

loadOverview(viewMap)