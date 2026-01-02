/* Copyright (C) 2025 Stefano
Licensed under the GNU GPL v3. See LICENSE file for details. */

function sortEntries(sorted) {
  if (!Array.isArray(sorted) || sorted.length === 0) return (a, b) => a.localeCompare(b);

  const ordered = [...sorted].sort((a, b) => b.length - a.length);
  const rank = new Map(sorted.map((c, i) => [c, i]));

  function tokenize(str) {
    const out = [];
    let i = 0;
    while (i < str.length) {
      let matched = false;
      for (const sym of ordered) {
        if (str.startsWith(sym, i)) {
          out.push(sym);
          i += sym.length;
          matched = true;
          break;
        }
      }
      if (!matched) out.push(str[i++]);
    }
    return out;
  }

  return (a, b) => {
    const ta = tokenize(a);
    const tb = tokenize(b);
    const n = Math.min(ta.length, tb.length);
    for (let i = 0; i < n; i++) {
      if (ta[i] === tb[i]) continue;
      const ra = rank.has(ta[i]) ? rank.get(ta[i]) : Infinity;
      const rb = rank.has(tb[i]) ? rank.get(tb[i]) : Infinity;
      if (ra !== rb) return ra - rb;
      return ta[i].localeCompare(tb[i]);
    }
    return ta.length - tb.length;
  };
}

module.exports = { sortEntries };
