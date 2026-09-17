import { publicContext } from '../entities/schema.js';
export function buildReply(state, extraction) {
  const c = publicContext(state);
  if (state.conflicts.length) {
    const conflict = state.conflicts.at(-1);
    if (conflict.field === 'part.side') return 'I have conflicting side details. Is the part for the driver side or passenger side?';
    return `I have two values for ${conflict.field.replace('.', ' ')}. Which one should I use?`;
  }
  if (extraction.facts['part.ambiguous']) return 'When you say plastic around the wheel, do you mean the outer metal fender, the plastic liner inside the wheel well, or the lower splash shield?';
  if (state.vehicle.possible_years?.length) return `Which model year should I use: ${state.vehicle.possible_years.join(' or ')}?`;
  if (!state.part.canonical_part_name) return 'What used part are you looking for?';
  if (!state.vehicle.year || !state.vehicle.make || !state.vehicle.model) return 'What is the vehicle year, make, and model?';
  if (state.part.canonical_part_name === 'hood' && !state.vehicle.body_style) return `For the ${state.vehicle.year} ${state.vehicle.make} ${state.vehicle.model}, is it a sedan, coupe, hatchback, pickup, or another body style?`;
  if (state.missing_information.some(x => x.endsWith('side'))) return 'Is the part for the driver side or passenger side?';
  return `I captured a ${state.vehicle.year} ${state.vehicle.make} ${state.vehicle.model} ${state.part.canonical_part_name}. I can check availability, price, and shipping once the inventory service is connected.`;
}
