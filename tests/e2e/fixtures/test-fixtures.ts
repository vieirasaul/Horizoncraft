import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { test as base, expect } from "@playwright/test";

export interface TestFixtures {
  coverage: void;
}

export const test = base.extend<TestFixtures>({
  coverage: [
    async ({ page }, use, testInfo) => {
      if (process.env.COVERAGE !== "true") {
        await use();
        return;
      }

      await page.coverage.startJSCoverage({ resetOnNavigation: false });
      await use();
      const entries = await page.coverage.stopJSCoverage();
      const outputDirectory = path.resolve("coverage/e2e/raw/client");
      const testId = `${testInfo.workerIndex}-${testInfo.testId.replace(/[^a-zA-Z0-9]/g, "-")}`;

      await mkdir(outputDirectory, { recursive: true });
      await writeFile(
        path.join(outputDirectory, `${testId}.json`),
        JSON.stringify({
          result: entries,
        }),
      );
    },
    { scope: "test", auto: true },
  ],
});

export { expect };
