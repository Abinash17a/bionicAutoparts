export const emptyState = () => ({
  vehicle: { year: null, possible_years: [], make: null, model: null, trim: null, generation: null, body_style: null, engine: null, engine_size: null, drivetrain: null, transmission: null, fuel_type: null, vin: null, mileage: null, vehicle_location: null, previous_location: null },
  part: { canonical_part_name: null, customer_term: null, part_category: null, side: null, position: null, front_rear: null, quantity: null, condition: null, damage_description: null, requested_condition: null, part_number: null, oem_number: null, aftermarket_number: null },
  request: { intent: [], part: null, customer_term: null, category: null, side: null, position: null, front_rear: null, driver_passenger: null, quantity: null, condition: null, part_number: null, oem_number: null },
  location: { current: null, shipping_destination: null, previous: null },
  problem: { description: null, damage: null, symptoms: [] },
  intent: [], missing_information: [], conflicts: [], facts: {}, confidence: {}, sources: {}, history: []
});

export const knownKeys = new Set([...Object.keys(emptyState().vehicle).map(k => `vehicle.${k}`), ...Object.keys(emptyState().part).map(k => `part.${k}`)]);

export function publicContext(state) {
  const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== null && value !== '' && (!Array.isArray(value) || value.length)));
  return { vehicle: compact(state.vehicle), part: compact(state.part), request: compact(state.request || {}), location: compact(state.location || {}), problem: compact(state.problem || {}), confidence: state.confidence || {}, sources: state.sources || {} };
}
