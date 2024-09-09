import { existsSync } from "fs";
import path from "path";
import { datapackSchema } from "../lib/pack";

export type Config = Awaited<ReturnType<typeof loadConfig>>;

export async function loadConfigFromPath(configPath: string) {
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found at ${configPath}`);
  }

  const rawConfig = (await import(configPath)).default;
  return datapackSchema.parse(rawConfig);
}

export async function loadConfig() {
  const configPath = path.resolve(
    process.cwd(),
    process.env.DP_CONFIG || "data-pack.config.ts"
  );
  return await loadConfigFromPath(configPath);
}
