import { z } from "zod";
import { functionConfigSchema, type FunctionConfig } from "./functions";
import path from "path";
import { recipeConfigSchema } from "./recipe";

export type RawPackConfig = {
  functions?: FunctionConfig[];
  namespace: string;
  staticDir?: string;
  generatedDir?: string;
  outDir?: string;
};

export const packConfigSchema = z.object({
  functions: z.array(functionConfigSchema).default([]),
  recipes: z.array(recipeConfigSchema).default([]),
  namespace: z.string(),
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
export type PackConfig = z.infer<typeof packConfigSchema>;

export function packConfig(config: RawPackConfig): PackConfig {
  return packConfigSchema.parse(config);
}
