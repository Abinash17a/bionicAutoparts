import { partRequirements } from '../normalization/parts.js';

const setFact = (state, key, entry, { correction = false, uncertain = false } = {}) => {
  const previous = state.facts[key]?.value;
  if (previous !== undefined && JSON.stringify(previous) !== JSON.stringify(entry.value)) {
    if (correction && !uncertain) state.history.push({ type: 'correction', field: key, old_value: previous, new_value: entry.value, at: new Date().toISOString() });
    else state.conflicts.push({ field: key, previous, received: entry.value });
  }
  const [scope, field] = key.split('.');
  if (scope === 'vehicle') state.vehicle[field] = entry.value;
  if (scope === 'vehicle' && field === 'year') state.vehicle.possible_years = [];
  if (scope === 'part') state.part[field] = entry.value;
  if (scope === 'part') {
    const requestMap = { canonical_part_name: 'part', customer_term: 'customer_term', part_category: 'category', side: 'side', front_rear: 'front_rear', quantity: 'quantity', requested_condition: 'condition', part_number: 'part_number', oem_number: 'oem_number' };
    if (requestMap[field] && state.request) state.request[requestMap[field]] = entry.value;
  }
  if (scope === 'vehicle' && field === 'vehicle_location') state.location.shipping_destination = entry.value;
  if (scope === 'vehicle' && field === 'previous_location') state.location.previous = entry.value;
  state.confidence[key] = entry.confidence;
  state.sources[key] = entry.source === 'explicit' ? 'explicit_user' : entry.source;
  state.facts[key] = { ...entry, updated_at: new Date().toISOString() };
};

export function updateState(state, extraction, text) {
  const correction = /\b(actually|correction|sorry|instead)\b/i.test(text);
  const uncertain = /\b(i think|might|maybe|either|not sure)\b/i.test(text);
  for (const [key, entry] of Object.entries(extraction.facts)) {
    if (key === 'part.ambiguous') continue;
    setFact(state, key, { ...entry, source: correction ? 'explicit_correction' : entry.source }, { correction, uncertain });
  }
  state.history.push({ text, at: new Date().toISOString() });
  const missing = [];
  if (!state.vehicle.year && !state.vehicle.possible_years?.length) missing.push('vehicle.year');
  if (!state.vehicle.make) missing.push('vehicle.make');
  if (!state.vehicle.model) missing.push('vehicle.model');
  if (!state.part.canonical_part_name) missing.push('part.canonical_part_name');
  if (state.part.canonical_part_name && partRequirements[state.part.canonical_part_name]) {
    for (const field of partRequirements[state.part.canonical_part_name]) if (!state.vehicle[field] && !state.part[field]) missing.push(`vehicle.${field}`);
  }
  state.missing_information = [...new Set(missing)];
  state.request.intent = state.intent;
  return state;
}
