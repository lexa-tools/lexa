/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

export function renderCounts(containerId, counts) {
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