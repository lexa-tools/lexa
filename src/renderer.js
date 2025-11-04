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
  const entries = document.getElementById('lexicon-entries');

  entries.textContent = `${lexiconSummary.entries}`;
});

window.electronAPI.onLexiconCounts((lexiconCounts) => {
  const container = document.getElementById('lexicon-pos');
  container.innerHTML = '';

  Object.entries(lexiconCounts.part_of_speech).forEach(([pos, count], i, arr) => {
    const div = document.createElement('div');
    div.className = 'split-badge';

    const label = document.createElement('span');
    label.className = 'badge-label text-bg-gray-3';
    label.textContent = pos.charAt(0).toUpperCase() + pos.slice(1);

    const number = document.createElement('span');
    number.className = 'badge-count';
    number.textContent = count;

    div.appendChild(label);
    div.appendChild(number);
    container.appendChild(div);

    // add a space between badges (but not after the last one)
    if (i < arr.length - 1) {
      container.appendChild(document.createTextNode(' '));
    }
  });
});

function renderCounts(containerId, counts) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  Object.entries(counts).forEach(([labelText, count], i, arr) => {
    const div = document.createElement('div');
    div.className = 'split-badge';

    const label = document.createElement('span');
    label.className = 'badge-label text-bg-gray-3';
    label.textContent = labelText.charAt(0).toUpperCase() + labelText.slice(1);

    const number = document.createElement('span');
    number.className = 'badge-count';
    number.textContent = count;

    div.appendChild(label);
    div.appendChild(number);
    container.appendChild(div);

    if (i < arr.length - 1) {
      container.appendChild(document.createTextNode(' '));
    }
  });
}

window.electronAPI.onLexiconCounts((lexiconCounts) => {
  renderCounts('lexicon-categories', lexiconCounts.morph_category);
  renderCounts('lexicon-types', lexiconCounts.morph_type);
  renderCounts('lexicon-pos', lexiconCounts.part_of_speech);
});
