import { z } from "zod";
import { createDirectoryIfNotExists, getDatapackPath } from "../util/file";
import { writeFile } from "fs/promises";
import { type DataPack } from "./pack";

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
  const { generated: filePath } = getDatapackPath(config, "function", {
    namespace,
    fileName: name,
  });
  await createDirectoryIfNotExists(filePath);
  await writeFile(filePath, func.command, "utf-8");
}
