import path from "path";
import { datapackSchema } from "../lib/pack";

export async function loadConfig() {
  const rawConfig = (await import(path.resolve(process.cwd(), "data-pack.config.ts"))).default;
  return datapackSchema.parse(
    rawConfig
  );
}