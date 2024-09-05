import fs from "fs/promises";
import { loadConfig } from "../util/config";
import { copyRecursive } from "../lib/file";

export async function bundle() {
  const config = await loadConfig();

  // delete output directory
  await fs.rmdir(config.outDir, { recursive: true });

  // create output directory
  await fs.mkdir(config.outDir, { recursive: true });

  // copy all static files to the bundle directory
  await copyRecursive(config.staticDir, config.outDir);

  // run all bundles tasks
  await Promise.all(config.functions.map((func) => func.bundle(config)));
}
