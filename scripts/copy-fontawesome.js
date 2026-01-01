/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

// Paths
const NODE_MODULES_PATH = path.join(__dirname, '../node_modules', '@fortawesome', 'fontawesome-free')
const DEST_PATH = path.join(__dirname, '../src/renderer', 'assets', 'vendor', 'fontawesome')

// Clear previous copy
fse.removeSync(DEST_PATH)

// Copy CSS
fse.copySync(path.join(NODE_MODULES_PATH, 'css'), path.join(DEST_PATH, 'css'))

// Copy webfonts
fse.copySync(path.join(NODE_MODULES_PATH, 'webfonts'), path.join(DEST_PATH, 'webfonts'))

console.log('FontAwesome copied to renderer/assets/vendor/fontawesome')
