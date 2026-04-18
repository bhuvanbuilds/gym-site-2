import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

if (existsSync("autumn.config.ts")) {
  const result = spawnSync(
    "bunx",
    ["tsc", "--noEmit", "--skipLibCheck", "autumn.config.ts"],
    {
      stdio: "inherit",
      shell: false,
    },
  );

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
