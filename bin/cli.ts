import { program } from "commander";
import { generate } from "./generate";
import { bundle } from "./bundle";

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
