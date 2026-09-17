export const knowledgeSchema = [
  `CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY, make TEXT NOT NULL, model TEXT NOT NULL, year_start INTEGER, year_end INTEGER, generation TEXT, body_style TEXT, aliases TEXT, active INTEGER DEFAULT 1)`,
  `CREATE TABLE IF NOT EXISTS vehicle_aliases (alias TEXT PRIMARY KEY, vehicle_id INTEGER NOT NULL, confidence REAL DEFAULT 1.0)`,
  `CREATE TABLE IF NOT EXISTS parts (id INTEGER PRIMARY KEY, canonical_name TEXT UNIQUE NOT NULL, category TEXT NOT NULL, active INTEGER DEFAULT 1)`,
  `CREATE TABLE IF NOT EXISTS part_aliases (alias TEXT PRIMARY KEY, part_id INTEGER NOT NULL, alias_type TEXT DEFAULT 'safe', confidence REAL DEFAULT 1.0)`,
  `CREATE TABLE IF NOT EXISTS part_categories (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS vehicle_part_rules (vehicle_id INTEGER, part_id INTEGER, body_style TEXT, notes TEXT, PRIMARY KEY(vehicle_id, part_id, body_style))`,
  `CREATE INDEX IF NOT EXISTS idx_vehicle_lookup ON vehicles(make, model, year_start, year_end)`,
  `CREATE INDEX IF NOT EXISTS idx_part_alias ON part_aliases(alias)`
];
