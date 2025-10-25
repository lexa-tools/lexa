
// Send lexadb name
window.electronAPI.onLexadbName((lexadbName) => {
  const pathElement = document.getElementById('lexadb-name');
  pathElement.textContent = `${lexadbName}`;
});

// Send lexadb path
window.electronAPI.onLexadbOpened((lexadbPath) => {
  const pathElement = document.getElementById('lexadb-path');
  pathElement.textContent = `${lexadbPath}`;
});

// Send lexadb validation
window.electronAPI.onLexadbValidation((validation) => {
  const icon = document.getElementById('lexadb-validation');

  // Clear any previous validation classes
  icon.classList.remove('valid', 'invalid');

  // Apply a new class based on validation
  if (validation.valid) {
    icon.classList.add('statusbar__icon--valid');
  } else {
    icon.classList.add('statusbar__icon--invalid');
  }
});
