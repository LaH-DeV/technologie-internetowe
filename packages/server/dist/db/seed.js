import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { texts } from "./schema.js";
import { generateSeedTexts } from "../domain/word-lists.js";
async function seed() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("DATABASE_URL is required");
        process.exit(1);
    }
    const pool = new pg.Pool({ connectionString: url });
    const database = drizzle(pool);
    console.log("Seeding database...");
    const entries = generateSeedTexts(10, 200);
    await database.insert(texts).values(entries);
    console.log(`Seeded ${entries.length} texts`);
    await pool.end();
}
seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map