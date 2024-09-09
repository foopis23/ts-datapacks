#!/usr/bin/env bun
import { program } from "commander";
import { TSDataPack } from "../lib/ts-datapack";

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
    const newProjectDir = await TSDataPack.createMCDatapack(projectName);

    console.log(
      `Initialized new project in ${newProjectDir}.\n Run 'cd ${projectName}' and 'bun install' to get started.`
    );
  });

program
  .command("build")
  .description("Generate and bundle the data pack")
  .action(async () => {
    await TSDataPack.fromDefaultConfig().then((tsDataPack) =>
      tsDataPack.build()
    );
  });

const debugSubCommands = program.command("debug");

debugSubCommands
  .command("generate")
  .description(
    "Generate dynamic elements of the data pack. This is mostly for debugging."
  )
  .action(async () => {
    await TSDataPack.fromDefaultConfig().then((tsDataPack) =>
      tsDataPack.generateAll()
    );
  });

debugSubCommands
  .command("bundle")
  .description("Bundle pre-generated files into the output directory. This is mostly for debugging.")
  .action(async () => {
    await TSDataPack.fromDefaultConfig().then((tsDataPack) =>
      tsDataPack.bundle()
    );
  });

program.parse(process.argv);
