import { itemIdSchema } from "./items";
import { z } from "zod";
import type { DataPack } from "./pack";
import { createDirectoryIfNotExists, getDatapackPath } from "../util/file";
import { writeFile } from "fs/promises";

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
  namespace: z.string().optional(),
});

const baseCookingRecipe = baseRecipe.extend({
  ingredient: ingredientItemSchema,
  result: resultItemSchema,
  experience: z.number().optional(),
  cookingTime: z.number().optional(),
});

const baseCraftingRecipe = baseRecipe.extend({
  result: resultItemWithCountSchema,
});

export const recipeSchema = z.union([
  baseCookingRecipe.extend({ type: z.literal("minecraft:blasting") }),
  baseCookingRecipe.extend({ type: z.literal("minecraft:campfire_cooking") }),
  baseCookingRecipe.extend({ type: z.literal("minecraft:smelting") }),
  baseCookingRecipe.extend({ type: z.literal("minecraft:smoking") }),
  baseCraftingRecipe.extend({
    type: z.literal("minecraft:crafting_shaped"),
    pattern: z.array(z.string()),
    key: z.record(z.string(), ingredientItemSchema),
  }),
  baseCraftingRecipe.extend({
    type: z.literal("minecraft:crafting_shapeless"),
    ingredients: z.array(ingredientItemSchema),
  }),
  baseCraftingRecipe.extend({
    type: z.literal("minecraft:stonecutting"),
    ingredient: ingredientItemSchema,
  }),
]);

export type Recipe = z.infer<typeof recipeSchema>;

export async function generateRecipe(
  config: DataPack,
  slug: string,
  recipe: Recipe
) {
  const namespace = recipe.namespace ?? config.defaultNamespace;
  const { generated: recipePath } = getDatapackPath(config, "recipe", {
    namespace,
    fileName: slug,
  });
  await createDirectoryIfNotExists(recipePath);

  // extract the recipes properties into a JSON object
  const recipeJson = {
    type: recipe.type,
    group: recipe.group,
    category: recipe.category,
    result: recipe.result,
    ...("pattern" in recipe && { pattern: recipe.pattern }),
    ...("key" in recipe && { key: recipe.key }),
    ...("ingredients" in recipe && { ingredients: recipe.ingredients }),
    ...("ingredient" in recipe && { ingredient: recipe.ingredient }),
    ...("experience" in recipe && { experience: recipe.experience }),
    ...("cookingTime" in recipe && { cookingTime: recipe.cookingTime }),
  };

  await writeFile(recipePath, JSON.stringify(recipeJson, null, 2), "utf-8");
}
