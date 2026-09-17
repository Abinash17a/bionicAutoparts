export function normalizeWithKnowledge(extraction, text, knowledgeBase) {
  const facts = extraction.facts;
  const lower = text.toLowerCase();
  if (!facts['vehicle.model']) {
    const candidates = [];
    for (const row of knowledgeBase.database.db.prepare('SELECT * FROM vehicles').all()) {
      const terms = [row.model, ...(row.aliases || '').split(',')].filter(Boolean).map(value => value.trim().toLowerCase()).filter(term => term.length > 2);
      if (terms.some(term => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[ -]?')}\\b`, 'i').test(lower))) candidates.push(row);
    }
    const unique = [...new Map(candidates.map(row => [`${row.make}:${row.model}`, row])).values()];
    if (unique.length === 1) { facts['vehicle.make'] = { value: unique[0].make, source: 'database_match', confidence: 0.91 }; facts['vehicle.model'] = { value: unique[0].model, source: 'database_match', confidence: 0.91 }; }
  }
  let term = facts['part.customer_term']?.value;
  const aliases = knowledgeBase.database.db.prepare('SELECT alias FROM part_aliases ORDER BY length(alias) DESC').all();
  const match = aliases.find(row => lower.includes(row.alias.toLowerCase()));
  if (match) { term = match.alias; facts['part.customer_term'] = { value: term, source: 'alias_match', confidence: 0.9 }; }
  if (term) {
    const alias = knowledgeBase.findPartAlias(term);
    if (alias) { facts['part.canonical_part_name'] = { value: alias.canonical_name, source: 'alias_match', confidence: alias.confidence }; facts['part.part_category'] = { value: alias.category, source: 'database_match', confidence: 0.95 }; }
    else { const candidates = knowledgeBase.findPartCandidates(term); if (candidates.length === 1) facts['part.canonical_part_name'] = { value: candidates[0].part, source: 'database_match', confidence: candidates[0].confidence || 0.8 }; }
  }
  const vehicle = facts['vehicle.make'] && facts['vehicle.model'] ? knowledgeBase.findVehicle({ make: facts['vehicle.make'].value, model: facts['vehicle.model'].value, year: facts['vehicle.year']?.value }) : [];
  if (vehicle.length === 1 && !facts['vehicle.body_style']) facts['vehicle.body_style'] = { value: vehicle[0].body_style, source: 'database_match', confidence: 0.86 };
  return extraction;
}
