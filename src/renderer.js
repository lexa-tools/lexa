
window.electronAPI.onProjectOpened((projectPath) => {
  const pathElement = document.getElementById('project-path');
  pathElement.textContent = `Opened project: ${projectPath}`;
});

window.electronAPI.onProjectValidation((validation) => {
  const pathElement = document.getElementById('project-validation');
  pathElement.textContent = `Valid: ${validation.valid}`;
});
