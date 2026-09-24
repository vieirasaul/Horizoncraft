import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { CDPClient, CoverageReport } from "monocart-coverage-reports";

const coverageOptions = {
  baseDir: process.cwd(),
  reports: ["v8", "lcovonly", "json-summary", "console-summary"],
  sourceFilter: (sourcePath: string) => {
    const normalizedPath = sourcePath.replaceAll("\\", "/");
    const relativePath = path
      .relative(process.cwd(), path.resolve(sourcePath))
      .replaceAll("\\", "/");
    return [normalizedPath, relativePath].some((candidate) =>
      /^(?:_N_E\/)?(?:app|components|lib)\/.+\.(?:ts|tsx|js|jsx)$/.test(
        candidate,
      ),
    );
  },
};

export default async function globalTeardown() {
  if (process.env.COVERAGE !== "true") return;

  const client = await CDPClient({ port: 9230 });
  if (!client) throw new Error("Could not connect to the E2E coverage target.");
  await client.writeCoverage();
  await client.close();

  const report = new CoverageReport({
    ...coverageOptions,
    outputDir: path.resolve("coverage/e2e/report"),
    all: ["app", "components", "lib"],
  });

  const clientDirectory = path.resolve("coverage/e2e/raw/client");
  for (const filename of await readdir(clientDirectory)) {
    if (!filename.endsWith(".json")) continue;
    const data = JSON.parse(
      await readFile(path.join(clientDirectory, filename), "utf8"),
    );
    await report.add(data.result);
  }

  await report.addFromDir(path.resolve("coverage/e2e/raw/server"));
  await report.generate();
}
