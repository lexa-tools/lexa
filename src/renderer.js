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

window.electronAPI.onLexiconSummary((lexiconSummary) => {
  renderCounts('lexicon-entries', { total: lexiconSummary.entries });
});

window.electronAPI.onLexiconCounts((lexiconCounts) => {
  renderCounts('lexicon-class', lexiconCounts.word_class);
});

async function loadView(viewId, file) {
  const container = document.getElementById(viewId)

  if (container.dataset.loaded) return

  const res = await fetch(`views/${file}`)
  container.innerHTML = await res.text()
  container.dataset.loaded = "true"
}

const viewMap = {
  "view-overview": "overview.html",
  "view-lexicon": "lexicon.html"
}

// Sidebar logic
document.querySelectorAll('.sidebar__nav-item[data-view]')
  .forEach(item => {
    item.addEventListener('click', async () => {
      const target = item.dataset.view

      await loadView(target, viewMap[target])

      document.querySelectorAll('.main__view')
        .forEach(v => v.classList.remove('main__view--active'))

      document.getElementById(target)
        .classList.add('main__view--active')

      document.querySelectorAll('.sidebar__nav-item i')
        .forEach(i => {
          i.classList.remove('sidebar__icon--active')
          i.classList.add('sidebar__icon')
        })

      const icon = item.querySelector('i')
      icon.classList.add('sidebar__icon--active')
      icon.classList.remove('sidebar__icon')
    })
  })

// Load overview view on open
document.addEventListener('DOMContentLoaded', async () => {
  const defaultView = 'view-overview'

  await loadView(defaultView, viewMap[defaultView])

  document.getElementById(defaultView)
    .classList.add('main__view--active')
})
