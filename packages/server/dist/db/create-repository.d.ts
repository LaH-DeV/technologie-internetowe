import type { Repository } from "./repository.js";
export declare function createRepository(): Promise<{
    repo: Repository;
    mode: "postgres" | "in-memory";
}>;
//# sourceMappingURL=create-repository.d.ts.map