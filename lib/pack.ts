import { z } from "zod";
import { functionSchema, type Function } from "./functions";
import path from "path";
import { recipeSchema, type Recipe } from "./recipes";

export type RawPackConfig = {
  functions?: Record<string, Function>;
  recipes?: Record<string, Recipe>;
  defaultNamespace: string;
  staticDir?: string;
  generatedDir?: string;
  outDir?: string;
};

export const datapackSchema = z.object({
  functions: z.record(z.string(), functionSchema).default({}),
  recipes: z.record(z.string(), recipeSchema).default({}),
  defaultNamespace: z.string(),
  staticDir: z
    .string()
    .default("./static")
    .transform((val) => path.resolve(process.cwd(), val)),
  generatedDir: z
    .string()
    .default("./.generated")
    .transform((val) => path.resolve(process.cwd(), val)),
  outDir: z
    .string()
    .default("./.data-pack")
    .transform((val) => path.resolve(process.cwd(), val)),
});
export type DataPack = z.infer<typeof datapackSchema>;

export function datapack(config: RawPackConfig): DataPack {
  return datapackSchema.parse(config);
}
