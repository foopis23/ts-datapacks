import path from "path";
import { itemIdSchema, type ItemID } from "./items";
import { z } from "zod";
import type { DataPack } from "./pack";
import { createDirectoryIfNotExists } from "../util/file";
import { writeFile, cp } from "fs/promises";

export const ingredientItemSchema = z.union([
  itemIdSchema,
  z.array(itemIdSchema),
]);
export type IngredientItem = z.infer<typeof ingredientItemSchema>;

const resultItemSchema = z.object({
  id: itemIdSchema,
  components: z.record(z.string(), z.unknown()).optional(),
});

export type ResultItem = z.infer<typeof resultItemSchema>;

const resultItemWithCountSchema = resultItemSchema.extend({
  count: z.number().optional(),
});

export type ResultItemWithCount = z.infer<typeof resultItemWithCountSchema>;

const recipeBookCategorySchema = z.union([
  z.literal("blocks"),
  z.literal("misc"),
]);

export type RecipeBookCategory = z.infer<typeof recipeBookCategorySchema>;

const baseRecipe = z.object({
  group: z.string().optional(),
  category: recipeBookCategorySchema.optional(),
});

const baseCookingRecipe = baseRecipe.extend({
  ingredient: ingredientItemSchema,
  result: resultItemSchema,
  experience: z.number().optional(),
  cookingTime: z.number().optional(),
});

export const recipeSchema = z.union([
  baseCookingRecipe.extend({ type: z.literal("minecraft:blasting") }),
  baseCookingRecipe.extend({ type: z.literal("minecraft:campfire_cooking") }),
  baseCookingRecipe.extend({ type: z.literal("minecraft:smelting") }),
  baseCookingRecipe.extend({ type: z.literal("minecraft:smoking") }),
  baseRecipe.extend({
    type: z.literal("minecraft:crafting_shaped"),
    pattern: z.array(z.string()),
    key: z.record(z.string(), ingredientItemSchema),
    result: resultItemWithCountSchema,
  }),
  baseRecipe.extend({
    type: z.literal("minecraft:crafting_shapeless"),
    ingredients: z.array(ingredientItemSchema),
    result: resultItemWithCountSchema,
  }),
  baseRecipe.extend({
    type: z.literal("minecraft:stonecutting"),
    ingredient: ingredientItemSchema,
    result: resultItemWithCountSchema,
  }),
]);

export type Recipe = z.infer<typeof recipeSchema>;

export async function generateRecipe(
  config: DataPack,
  slug: string,
  recipe: Recipe
) {
  const recipeDir = path.resolve(
    config.generatedDir,
    "data",
    config.namespace,
    "recipe"
  );
  await createDirectoryIfNotExists(recipeDir);

  await writeFile(
    path.resolve(recipeDir, `${slug}.json`),
    JSON.stringify(recipe, null, 2),
    "utf-8"
  );
}

export async function bundleRecipe(config: DataPack, slug: string) {
  const genRecipeDir = path.resolve(
    config.generatedDir,
    "data",
    config.namespace,
    "recipe"
  );
  const outRecipeDir = path.resolve(
    config.outDir,
    "data",
    config.namespace,
    "recipe"
  );
  await createDirectoryIfNotExists(outRecipeDir);
  await cp(
    path.resolve(genRecipeDir, `${slug}.json`),
    path.resolve(outRecipeDir, `${slug}.json`)
  );
}
