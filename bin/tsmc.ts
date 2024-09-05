import fs from 'fs/promises';
import { program } from "commander";
import { loadConfig } from "../util/config";
import { copyRecursive } from "../util/file";

async function generate() {
  const config = await loadConfig();
  await Promise.all(config.functions.map((func) => func.generate(config)));
}

async function bundle() {
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

program
  .name("data-pack-lib")
  .description("A library for creating data packs for Minecraft")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize a new data pack")
  .action(() => {
    throw new Error("Not implemented");
  });

program
  .command("generate")
  .description("Generate dynamic elements of the data pack")
  .action(async () => {
    await generate();
  });

program
  .command("bundle")
  .description("Bundle the data pack")
  .action(async () => {
    await bundle();
  });

program
  .command("build")
  .description("Generate and bundle the data pack")
  .action(async () => {
    await generate();
    await bundle();
  });

program.parse(process.argv);
