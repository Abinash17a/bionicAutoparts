import { normalizePart } from '../normalization/parts.js';
import { extractVin } from '../validation/vin.js';

const catalog = [
  ['Honda', 'Civic'], ['Honda', 'Accord'], ['Toyota', 'Corolla'], ['Toyota', 'Camry'],
  ['Ford', 'F-150'], ['Ford', 'F-250'], ['BMW', '328i'], ['Chevrolet', 'Silverado'],
  ['Nissan', 'Altima'], ['Jeep', 'Wrangler'], ['Hyundai', 'Elantra'], ['Kia', 'Optima'], ['Mazda', '3'], ['Subaru', 'Outback'], ['Tesla', 'Model 3'], ['Volkswagen', 'Jetta'], ['Audi', 'A4']
];

const fact = (value, source = 'explicit', confidence = 0.98) => ({ value, source, confidence });

export function extractMessage(text) {
  const lower = text.toLowerCase();
  const facts = {};
  const years = [...text.matchAll(/\b(19\d{2}|20\d{2})\b/g)].map(m => Number(m[1]));
  if (years.length === 1) facts['vehicle.year'] = fact(years[0]);
  if (years.length > 1 && /\b(actually|sorry|instead)\b/i.test(text) && /\bnot\b/i.test(text)) facts['vehicle.year'] = fact(years[0], 'explicit_correction', 0.99);
  else if (years.length > 1) facts['vehicle.possible_years'] = fact([...new Set(years)]);
  for (const [make, model] of catalog) {
    const compact = model.replace(/[- ]/g, '[- ]?');
    const re = new RegExp(`\\b${make}\\s+${compact}\\b`, 'i');
    if (re.test(text)) { facts['vehicle.make'] = fact(make); facts['vehicle.model'] = fact(model); break; }
  }
  if (!facts['vehicle.model'] && /\b(?:f[- ]?150|f[- ]?250)\b/i.test(text)) { facts['vehicle.make'] = fact('Ford'); facts['vehicle.model'] = fact(/f[- ]?250/i.test(text) ? 'F-250' : 'F-150'); }
  if (!facts['vehicle.model'] && /\bmazda\s*3\b/i.test(text)) { facts['vehicle.make'] = fact('Mazda'); facts['vehicle.model'] = fact('3'); }
  const trim = text.match(/\b(LX|EX|Sport|Touring|Limited|XLT|Lariat|SE|LE|M Sport)\b/i);
  if (trim) facts['vehicle.trim'] = fact(trim[1]);
  const body = lower.match(/\b(sedan|coupe|hatchback|pickup|truck|suv|wagon|convertible)\b/);
  if (body) facts['vehicle.body_style'] = fact(body[1] === 'truck' ? 'pickup' : body[1]);
  const engine = lower.match(/\b(v[468]|\d(?:\.\d)?\s*l(?:iter)?|\d\.\d\s+turbo|turbo diesel)\b/i);
  if (engine) facts['vehicle.engine'] = fact(engine[1].toUpperCase());
  const transmission = lower.match(/\b(automatic|manual|cvt|dual[- ]clutch)\b/);
  if (transmission) facts['vehicle.transmission'] = fact(transmission[1].toLowerCase());
  const vin = extractVin(text);
  if (vin?.valid) facts['vehicle.vin'] = fact(vin.value);
  const part = normalizePart(text);
  if (!part.term && /(?:around (?:the )?wheel|wheel well|wheel[- ]arch|liner inside)/i.test(text)) { part.term = 'plastic around the wheel'; part.ambiguous = true; }
  if (/\bdown low\b.*\bbumper\b|\bfog\b/i.test(lower)) { part.canonical = 'fog light'; part.term = part.term || 'front lamp'; part.ambiguous = false; }
  if (!part.term && /\b(window|door)\b.*\b(won't|doesn't|not)\s+(?:go|work|move)/i.test(text)) { facts['part.canonical_part_name'] = fact('window switch', 'inferred', 0.78); facts['part.customer_term'] = fact('window control', 'explicit'); }
  if (part.term) facts['part.customer_term'] = fact(part.term);
  if (part.canonical) { facts['part.canonical_part_name'] = fact(part.canonical); facts['part.part_category'] = fact(part.canonical); }
  if (part.ambiguous) facts['part.ambiguous'] = fact(true);
  const side = lower.match(/\b(driver'?s?|left|passenger'?s?|right)\b/);
  if (side) facts['part.side'] = fact(side[1].startsWith('driver') ? 'driver' : side[1].startsWith('passenger') ? 'passenger' : side[1]);
  const position = lower.match(/\b(front|rear|back)\b/);
  if (position) facts['part.front_rear'] = fact(position[1] === 'back' ? 'rear' : position[1]);
  const quantity = lower.match(/\b(?:need|want|looking for)\s+(\d+)\b/);
  if (quantity) facts['part.quantity'] = fact(Number(quantity[1]));
  if (/\b(oem|original)\b/.test(lower)) facts['part.requested_condition'] = fact('OEM');
  if (/\b(used|pre[- ]owned|salvage)\b/.test(lower)) facts['part.requested_condition'] = fact('used');
  if (/\b(damaged|cracked|broken|dented|scratched)\b/.test(lower)) facts['part.damage_description'] = fact(text.match(/\b(damaged|cracked|broken|dented|scratched)\b/i)[1].toLowerCase());
  const destination = text.match(/\b(?:ship(?:ping)?|deliver(?:y)?)\b.*?\b(?:to|in)\s+([A-Za-z][A-Za-z .'-]+)/i) || text.match(/\bto\s+([A-Za-z][A-Za-z .'-]+)$/i);
  if (destination) facts['vehicle.vehicle_location'] = fact(destination[1].trim().replace(/[?.!,]+$/, ''));
  const move = text.match(/moved\s+from\s+([^,]+)\s+to\s+([^,.]+)/i);
  if (move) { facts['vehicle.previous_location'] = fact(move[1].trim()); facts['vehicle.vehicle_location'] = fact(move[2].trim()); }
  return { facts, text };
}
