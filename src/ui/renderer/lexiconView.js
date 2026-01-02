/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

export function renderLexicon(sheetLexicon, sidePanel, lexiconData) {
  if (!sheetLexicon || !sidePanel) return
  sheetLexicon.innerHTML = ''

  lexiconData.forEach(item => {
    const div = document.createElement('div')
    div.textContent = item.lexeme
    div.classList.add('lexicon-entry')

    div.addEventListener('click', () => {
      sidePanel.innerHTML = `<pre>${JSON.stringify(item.content, null, 2)}</pre>`
    })

    sheetLexicon.appendChild(div)
  })
}

