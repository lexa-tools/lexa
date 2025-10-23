
window.electronAPI.onLexadbOpened((lexadbPath) => {
  const pathElement = document.getElementById('lexadb-path');
  pathElement.textContent = `Opened Lexa DB: ${lexadbPath}`;
});

window.electronAPI.onLexadbValidation((validation) => {
  const pathElement = document.getElementById('lexadb-validation');
  pathElement.textContent = `Valid: ${validation.valid}`;
});
