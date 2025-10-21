window.electronAPI.onProjectOpened((projectPath) => {
  const pathElement = document.getElementById('project-path');
  pathElement.textContent = `Opened project: ${projectPath}`;
});