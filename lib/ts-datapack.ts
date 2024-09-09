import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { loadConfig, loadConfigFromPath, type Config } from "../util/config";
import { generateFunction } from "./functions";
import { generateRecipe } from "./recipes";
import {
  copyRecursive,
  replaceStringInTemplateFilesRecursive,
} from "../util/file";

/**
 * Main class for interacting with the TSDataPack "compiler".
 */
export class TSDataPack {
  constructor(public readonly config: Config) {}

  /**
   * Create a new project with the given name.
   *
   * Project will be create and be initialized in ./<projectName> directory. Project will be initialized with the default template.
   *
   * @param projectName name of new project
   */
  static async createMCDatapack(projectName: string) {
    const newProjectDir = path.resolve(process.cwd(), projectName);
    const templateDir = path.resolve(__dirname, "../template");

    // check if project name is file system safe
    if (projectName.match(/[^a-z0-9_-]/i)) {
      throw new Error(
        "Project name must only contain letters, numbers, underscores, and hyphens"
      );
    }

    // throw an error if the project name starts with a number
    if (projectName.match(/^[0-9]/)) {
      throw new Error("Project name must start with a letter");
    }

    // throw an error if project name starts with a hyphen
    if (projectName.startsWith("-")) {
      throw new Error("Project name must start with a letter");
    }

    // throw an error if project name starts with an underscore
    if (projectName.startsWith("_")) {
      throw new Error("Project name must start with a letter");
    }

    // throw an error if project name is empty
    if (projectName === "") {
      throw new Error("Project name must not be empty");
    }

    // check if the project directory already exists
    if (existsSync(newProjectDir)) {
      // check if folder is empty
      const files = await fs.readdir(newProjectDir);
      if (files.length > 0) {
        throw new Error(
          `Directory ${projectName} already exists and is not empty`
        );
      }
    }

    // create the project directory
    await fs.mkdir(projectName, { recursive: true });

    // copy all files from the template directory to the project directory
    await copyRecursive(templateDir, newProjectDir);

    // replace all instances of $name with the project name
    await replaceStringInTemplateFilesRecursive(newProjectDir, {
      "$project-name": projectName,
    });

    return newProjectDir;
  }

  /**
   * Generate all files defined in the config and bundle them
   */
  async build() {
    await this.generateAll();
    await this.bundle();

    // clean up generated files after bundling
    await fs.rmdir(this.config.generatedDir, { recursive: true });
  }

  /**
   * Generate all files defined in the config
   */
  async generateAll() {
    await this.generateRecipes();
    await this.generateFunctions();
  }

  /**
   * Bundle all static and generated files into the output directory
   */
  async bundle() {
    // delete previous output directory
    await fs.rmdir(this.config.outDir, { recursive: true });

    // create output directory
    await fs.mkdir(this.config.outDir, { recursive: true });

    // copy all static files to the bundle directory
    await copyRecursive(this.config.staticDir, this.config.outDir);

    // copy all generated files to the bundle directory
    await copyRecursive(this.config.generatedDir, this.config.outDir);
  }

  /**
   * Generate all recipes defined in the config
   */
  async generateRecipes() {
    await Promise.all(
      Object.entries(this.config.recipes).map(([slug, recipe]) =>
        generateRecipe(this.config, slug, recipe)
      )
    );
  }

  /**
   * Generate all functions defined in the config
   */
  async generateFunctions() {
    await Promise.all(
      Object.entries(this.config.functions).map(([slug, func]) =>
        generateFunction(this.config, slug, func)
      )
    );
  }

  static async fromDefaultConfig() {
    const config = await loadConfig();
    return new TSDataPack(config);
  }

  static async fromConfigPath(configPath: string) {
    const config = await loadConfigFromPath(configPath);
    return new TSDataPack(config);
  }
}
