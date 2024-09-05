import path from "path";
import { packConfigSchema } from "../lib/pack";

export async function loadConfig() {
  const rawConfig = (await import(path.resolve(process.cwd(), "data-pack.config.ts"))).default;
  return packConfigSchema.parse(
    rawConfig
  );
}