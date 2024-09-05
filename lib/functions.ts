import { z } from "zod";
import { createDirectoryIfNotExists } from "../util/file";
import { writeFile } from "fs/promises";
import path from "path";
import { type PackConfig } from "./pack";
import { cp } from "fs/promises";

export function command(strings: TemplateStringsArray, ...values: unknown[]) {
  // turn arrays into strings seperated by newlines
  values = values.map((value) =>
    Array.isArray(value) ? value.join("\n") : value
  );

  // combine the templates and values
  const func = strings
    .map((template, index) => `${template}${values[index] ?? ""}`)
    .join("");

  return func
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}

export const functionConfigSchema = z.object({
  name: z.string(),
  content: z.string(),
  generate: z.function(),
  bundle: z.function(),
});
export type FunctionConfig = z.infer<typeof functionConfigSchema>;

export function functionConfig(config: {
  name: string;
  command: string;
}): FunctionConfig {
  const { name, command: content } = config;
  return functionConfigSchema.parse({
    name: name,
    content: content,
    generate: async (packConfig: PackConfig) => {
      const funcDir = path.resolve(
        packConfig.generatedDir,
        "data",
        packConfig.namespace,
        "functions"
      );
      await createDirectoryIfNotExists(funcDir);
      await writeFile(
        path.resolve(funcDir, `${name}.mcfunction`),
        content,
        "utf-8"
      );
    },
    bundle: async (packConfig: PackConfig) => {
      const genFuncDir = path.resolve(
        packConfig.generatedDir,
        "data",
        packConfig.namespace,
        "functions"
      );
      const outFuncDir = path.resolve(
        packConfig.outDir,
        "data",
        packConfig.namespace,
        "functions"
      );
      await createDirectoryIfNotExists(outFuncDir);
      await cp(
        path.resolve(genFuncDir, `${name}.mcfunction`),
        path.resolve(outFuncDir, `${name}.mcfunction`)
      );
    },
  });
}
