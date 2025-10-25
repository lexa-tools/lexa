
// Send lexadb path
window.electronAPI.onLexadbOpened((lexadbPath) => {
  const pathElement = document.getElementById('lexadb-path');
  pathElement.textContent = `${lexadbPath}`;
});

// Send lexadb validation
window.electronAPI.onLexadbValidation((validation) => {
  const pathElement = document.getElementById('lexadb-validation');
  pathElement.textContent = `Valid: ${validation.valid}`;
});
