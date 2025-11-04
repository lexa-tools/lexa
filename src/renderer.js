/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

// Send lexadb name
window.electronAPI.onLexadbName((lexadbName) => {
  const pathElement = document.getElementById('lexadb-name');
  pathElement.textContent = `${lexadbName}`;
});

// Send lexadb author
window.electronAPI.onLexadbAuthor((lexadbAuthor) => {
  const pathElement = document.getElementById('lexadb-author');
  pathElement.textContent = `${lexadbAuthor}`;
});

// Send lexadb path
window.electronAPI.onLexadbOpened((lexadbPath) => {
  const pathElement = document.getElementById('lexadb-path');
  pathElement.textContent = `${lexadbPath}`;
});

// Send lexadb validation
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
  const entries = document.getElementById('lexadb-entries');

  entries.textContent = `${lexiconSummary.entries}`;
});