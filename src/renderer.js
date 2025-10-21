import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

window.electronAPI.onProjectOpened((projectPath) => {
  const pathElement = document.getElementById('project-path');
  pathElement.textContent = `Opened project: ${projectPath}`;
});