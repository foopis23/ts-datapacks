import { loadConfig } from "../util/config";

export async function generate() {
  const config = await loadConfig();
  await Promise.all(config.functions.map((func) => func.generate(config)));
}
