/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

const path = require('node:path');
const fs = require('fs');
const yaml = require('yaml');
const glob = require('glob');

async function lexiconSummarise(lexadbPath) {
    const files = glob.sync(path.join(lexadbPath, 'lexicon', '*.yaml'));

    return { entries: files.length };
}

module.exports = { lexiconSummarise };

