#!/usr/bin/env bun
import path from "path";
import fs from "fs/promises";
import { program } from "commander";
import { loadConfig } from "../util/config";
import {
  copyRecursive,
  replaceStringInTemplateFilesRecursive,
} from "../util/file";
import { generateRecipe } from "../lib/recipe";
import { generateFunction } from "../lib/functions";

type Config = Awaited<ReturnType<typeof loadConfig>>;

async function generate(config: Config) {
  await Promise.all(
    Object.entries(config.functions).map(([slug, func]) =>
      generateFunction(config, slug, func)
    )
  );
  await Promise.all(
    Object.entries(config.recipes).map(([slug, recipe]) =>
      generateRecipe(config, slug, recipe)
    )
  );
}

async function bundle(config: Config) {
  // delete output directory
  await fs.rmdir(config.outDir, { recursive: true });

  // create output directory
  await fs.mkdir(config.outDir, { recursive: true });

  // copy all static files to the bundle directory
  await copyRecursive(config.staticDir, config.outDir);

  // copy all generated files to the bundle directory
  await copyRecursive(config.generatedDir, config.outDir);
}

async function build(config: Config) {
  await generate(config);
  await bundle(config);

  // clean up
  await fs.rmdir(config.generatedDir, { recursive: true });
}

async function init(projectName: string) {
  const newProjectDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(__dirname, "../template");

  // create the project directory
  await fs.mkdir(projectName, { recursive: true });

  // copy all files from the template directory to the project directory
  await copyRecursive(templateDir, newProjectDir);

  // replace all instances of $name with the project name
  await replaceStringInTemplateFilesRecursive(newProjectDir, {
    "$project-name": projectName,
  });

  console.log(
    `Initialized new project in ${newProjectDir}.\n Run 'cd ${projectName}' and 'bun install' to get started.`
  );
}

program
  .name("data-pack-lib")
  .description("A library for creating data packs for Minecraft")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize a new data pack")
  .argument("<projectName>", "Name of the project")
  .action(async (ctx) => {
    const projectName: string = ctx;
    // TODO: validate project name is file system safe
    // TODO: check if project already exists

    await init(projectName);
  });

program
  .command("build")
  .description("Generate and bundle the data pack")
  .action(async () => {
    const config = await loadConfig();
    await build(config);
  });

const debugSubCommands = program.command("debug");

debugSubCommands
  .command("generate")
  .description(
    "Generate dynamic elements of the data pack. This is mostly for debugging."
  )
  .action(async () => {
    const config = await loadConfig();
    await generate(config);
  });

debugSubCommands
  .command("bundle")
  .description("Bundle the data pack")
  .action(async () => {
    const config = await loadConfig();
    await bundle(config);
  });

program.parse(process.argv);
