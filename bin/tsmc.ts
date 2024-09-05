#!/usr/bin/env bun
import path from "path";
import fs from "fs/promises";
import { program } from "commander";
import { loadConfig } from "../util/config";
import {
  copyRecursive,
  replaceStringInTemplateFilesRecursive,
} from "../util/file";

type Config = Awaited<ReturnType<typeof loadConfig>>;

async function generate(config: Config) {
  await Promise.all(config.functions.map((func) => func.generate(config)));
}

async function bundle(config: Config) {
  // delete output directory
  await fs.rmdir(config.outDir, { recursive: true });

  // create output directory
  await fs.mkdir(config.outDir, { recursive: true });

  // copy all static files to the bundle directory
  await copyRecursive(config.staticDir, config.outDir);

  // run all bundles tasks
  await Promise.all(config.functions.map((func) => func.bundle(config)));
}

async function build(config: Config) {
  await generate(config);
  await bundle(config);

  // clean up
  await fs.rmdir(config.generatedDir, { recursive: true });
}

async function init(config: Config, projectName: string) {
  // we need to copy all the files into template directory into ${process.cwd()}/${projectName}
  // but anytime there is $name in the file, we need to replace it with projectName

  const newProjectDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(__dirname, "../../template");

  // create the project directory
  await fs.mkdir(projectName, { recursive: true });

  // copy all files from the template directory to the project directory
  await copyRecursive(templateDir, projectName);

  // replace all instances of $name with the project name
  await replaceStringInTemplateFilesRecursive(newProjectDir, {
    $name: projectName,
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
  .action(() => {
    throw new Error("Not implemented");
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
