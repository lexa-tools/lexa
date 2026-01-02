/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

import { renderCounts } from './overviewView.js'

export function registerIpcHandlers(lexiconDataRef) {
  window.electronAPI.onLexadbName(name => {
    document.getElementById('lexadb-name').textContent = name;
  });

  window.electronAPI.onLexadbAuthor(author => {
    document.getElementById('lexadb-author').textContent = author;
  });

  window.electronAPI.onLexadbOpened(async (lexadbPath) => {
    document.getElementById('lexadb-path').textContent = lexadbPath;
    try {
      const files = await window.electronAPI.readLexicon(lexadbPath);
      lexiconDataRef.length = 0;
      lexiconDataRef.push(...files);
    } catch (err) {
      console.error('Failed to preload lexicon', err);
      lexiconDataRef.length = 0;
    }
  });

  window.electronAPI.onLexadbValidation((validated) => {
    const icon = document.getElementById('lexadb-validation');

    // Clear any previous validation classes
    icon.classList.remove('valid', 'invalid');

    // Apply a new class based on validation
    if (validated.valid) {
      icon.classList.add('status--valid');
    } else {
      icon.classList.add('status--invalid');
    }

    const dbValid = document.getElementById('db-valid');

    if (validated.valid) {
      dbValid.classList.add('status--valid');
    } else {
      dbValid.classList.add('status--invalid');
    }
  });

  window.electronAPI.onLexiconValidation((validatedLexicon) => {
    const lexValid = document.getElementById('lexicon-valid');

    // Clear any previous validation classes
    lexValid.classList.remove('valid', 'invalid');

    // Apply a new class based on validation
    if (validatedLexicon.valid) {
      lexValid.classList.add('status--valid');
    } else {
      lexValid.classList.add('status--invalid');
    }
  });

  window.electronAPI.onLexiconSummary((lexiconSummary) => {
    renderCounts('lexicon-entries', { total: lexiconSummary.entries });
  });

  window.electronAPI.onLexiconCounts((lexiconCounts) => {
    renderCounts('lexicon-class', lexiconCounts.word_class);
  });
}
