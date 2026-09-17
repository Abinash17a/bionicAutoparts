export function classifyIntent(text, facts = {}) {
  const t = text.toLowerCase();
  const intents = [];
  if (facts['vehicle.vin'] || /\bvin\b/.test(t)) intents.push('ask_vehicle_information');
  if (/\b(ship|shipping|deliver|delivery|freight)\b/.test(t)) intents.push('ask_shipping');
  if (/\b(price|cost|how much|quote)\b/.test(t)) intents.push('ask_price');
  if (/\b(compatible|fit|fits|work with|interchange)\b/.test(t)) intents.push('verify_compatibility');
  if (/\b(used|salvage|condition)\b/.test(t)) intents.push('ask_condition');
  if (/\b(available|availability|in stock|have one|looking for|need|want|find)\b/.test(t) || facts['part.canonical_part_name']) intents.push('find_part');
  if (/\b(what is this|what's this|don't know what|not sure what|identify|control under the hood|around (?:the )?wheel|wheel well|front lamp)\b/.test(t)) intents.push('identify_part');
  if (/\b(broken|cracked|stopped working|won't|failed|hit|damaged|dented|smashed|leaking)\b/.test(t)) intents.push('describe_problem');
  return intents.length ? [...new Set(intents)] : ['unknown'];
}
