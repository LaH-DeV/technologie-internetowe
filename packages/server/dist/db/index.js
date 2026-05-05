import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";
import { env } from "../config/env.js";
let pool = null;
let _db = null;
export function getDb() {
    if (!_db) {
        pool = new pg.Pool({ connectionString: env.DATABASE_URL });
        _db = drizzle(pool, { schema });
    }
    return _db;
}
export async function closeDb() {
    if (pool) {
        await pool.end();
        pool = null;
        _db = null;
    }
}
//# sourceMappingURL=index.js.map