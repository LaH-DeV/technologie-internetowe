import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
export declare function getDb(): NodePgDatabase<typeof schema>;
export declare function closeDb(): Promise<void>;
//# sourceMappingURL=index.d.ts.map