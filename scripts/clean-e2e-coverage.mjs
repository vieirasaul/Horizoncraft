import { rm } from "node:fs/promises";

await rm("coverage/e2e/raw", { recursive: true, force: true });
await rm("coverage/e2e/report", { recursive: true, force: true });
