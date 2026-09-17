export class AutomotiveKnowledgeBase {
  constructor(database) { this.database = database; }
  findMake(make) { return this.database.db.prepare('SELECT DISTINCT make FROM vehicles WHERE lower(make)=lower(?) LIMIT 1').get(make) || null; }
  findModel(make, model) { return this.database.db.prepare('SELECT * FROM vehicles WHERE lower(make)=lower(?) AND lower(model)=lower(?)').all(make, model); }
  findVehicle({ make, model, year } = {}) {
    const rows = this.database.db.prepare('SELECT * FROM vehicles WHERE (? IS NULL OR lower(make)=lower(?)) AND (? IS NULL OR lower(model)=lower(?)) AND (? IS NULL OR year_start IS NULL OR year_start<=?) AND (? IS NULL OR year_end IS NULL OR year_end>=?)').all(make ?? null, make ?? null, model ?? null, model ?? null, year ?? null, year ?? null, year ?? null, year ?? null);
    return rows;
  }
  findVehicleAliases(alias) { return this.database.db.prepare('SELECT v.* FROM vehicles v WHERE lower(v.aliases) LIKE ?').all(`%${alias.toLowerCase()}%`); }
  findPart(name) { return this.database.db.prepare('SELECT * FROM parts WHERE lower(canonical_name)=lower(?) LIMIT 1').get(name) || null; }
  findPartAlias(alias) { return this.database.findPart(alias); }
  findPartCandidates(term) { const query = term.toLowerCase(); return this.database.db.prepare('SELECT p.canonical_name AS part, a.alias_type, a.confidence FROM part_aliases a JOIN parts p ON p.id=a.part_id WHERE lower(a.alias) LIKE ? OR lower(p.canonical_name) LIKE ?').all(`%${query}%`, `%${query}%`); }
  findCategory(category) { return this.database.db.prepare('SELECT * FROM parts WHERE lower(category)=lower(?)').all(category); }
  findCompatibilityRules(vehicleId, partId) { return this.database.db.prepare('SELECT * FROM vehicle_part_rules WHERE vehicle_id=? AND part_id=?').all(vehicleId, partId); }
}
