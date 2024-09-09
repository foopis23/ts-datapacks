import { z } from "zod";
import { createDirectoryIfNotExists } from "../util/file";
import { writeFile } from "fs/promises";
import path from "path";
import { type DataPack } from "./pack";
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
    .filter((line) => line.length > 0) // remove empty lines
    .join("\n");
}

export const functionSchema = z.object({
  command: z.string(),
  namespace: z.string().optional(),
});
export type Function = z.infer<typeof functionSchema>;

export async function generateFunction(
  config: DataPack,
  name: string,
  func: Function
) {
  const namespace = func.namespace ?? config.defaultNamespace;
  const funcDir = path.resolve(
    config.generatedDir,
    "data",
    namespace,
    "function"
  );
  await createDirectoryIfNotExists(funcDir);
  await writeFile(
    path.resolve(funcDir, `${name}.mcfunction`),
    func.command,
    "utf-8"
  );
}

export async function bundleFunction(
  config: DataPack,
  name: string,
  func: Function
) {
  const namespace = func.namespace ?? config.defaultNamespace;
  const genFuncDir = path.resolve(
    config.generatedDir,
    "data",
    namespace,
    "function"
  );
  const outFuncDir = path.resolve(config.outDir, "data", namespace, "function");
  await createDirectoryIfNotExists(outFuncDir);
  await cp(
    path.resolve(genFuncDir, `${name}.mcfunction`),
    path.resolve(outFuncDir, `${name}.mcfunction`)
  );
}
