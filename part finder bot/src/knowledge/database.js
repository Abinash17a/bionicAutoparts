import { DatabaseSync } from 'node:sqlite';
import { knowledgeSchema } from './schema.js';
import { seedVehicles, seedParts, seedPartAliases } from './seed.js';
export class KnowledgeDatabase {
  constructor(filename = ':memory:') { this.db = new DatabaseSync(filename); knowledgeSchema.forEach(sql => this.db.exec(sql)); this.seed(); }
  seed() { if (this.db.prepare('SELECT COUNT(*) AS n FROM vehicles').get().n) return; const v=this.db.prepare('INSERT INTO vehicles(make,model,year_start,year_end,generation,body_style,aliases) VALUES(?,?,?,?,?,?,?)'); const va=this.db.prepare('INSERT OR IGNORE INTO vehicle_aliases(alias,vehicle_id,confidence) VALUES(?,?,?)'); for(const row of seedVehicles){v.run(...row); const id=this.db.prepare('SELECT last_insert_rowid() AS id').get().id; for(const alias of row[6].split(',')) va.run(alias.trim(),id,0.9);} const p=this.db.prepare('INSERT INTO parts(canonical_name,category) VALUES(?,?)'); for(const row of seedParts)p.run(...row); const ids=new Map(this.db.prepare('SELECT id,canonical_name FROM parts').all().map(x=>[x.canonical_name,x.id])); const a=this.db.prepare('INSERT OR IGNORE INTO part_aliases(alias,part_id,alias_type,confidence) VALUES(?,?,?,?)'); for(const [name,aliases] of Object.entries(seedPartAliases)) for(const alias of aliases)a.run(alias,ids.get(name)||0,name==='wheel arch area'?'ambiguous':'safe',name==='wheel arch area'?0.35:0.98); }
  findVehicle(text) { const q=text.toLowerCase().replace(/\s+/g,' ').trim(); return this.db.prepare('SELECT * FROM vehicles WHERE lower(make||" "||model)=? OR lower(aliases) LIKE ? LIMIT 3').all(q,`%${q}%`); }
  findPart(alias) { return this.db.prepare('SELECT p.*, a.alias_type, a.confidence FROM part_aliases a JOIN parts p ON p.id=a.part_id WHERE lower(a.alias)=?').get(alias.toLowerCase()) || null; }
  close() { this.db.close(); }
}
