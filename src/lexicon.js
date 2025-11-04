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

async function lexiconCount(lexadbPath) {
  const counts = {
    morph_category: {},
    morph_type: {},
    part_of_speech: {},
  };

  const files = glob.sync(path.join(lexadbPath, 'lexicon', '*.yaml'));

  for (const file of files) {
    const data = yaml.parse(fs.readFileSync(file, "utf8"));

    ["morph_category", "morph_type", "part_of_speech"].forEach(field => {
      if (data[field]) {
        const value = data[field];
        counts[field][value] = (counts[field][value] || 0) + 1;
      }
    });
  }
//   console.log(counts);
  return counts;
}

module.exports = { lexiconSummarise, lexiconCount };

