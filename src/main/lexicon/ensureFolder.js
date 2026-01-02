/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const fs = require('fs');

async function ensureFolder(folderPath) {
  await fs.promises.mkdir(folderPath, { recursive: true });
}

module.exports = { ensureFolder };
