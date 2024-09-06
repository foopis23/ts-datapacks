import path from "path";
import type { PackConfig } from "./pack";
import { createDirectoryIfNotExists } from "../util/file";
import { writeFile, cp } from "fs/promises";
import type { ItemID } from "./items";
import { z } from "zod";

// TODO: make this a union of all possible item IDs
export type IngredientItem = {
  item: ItemID;
  tag?: string;
};

export type ResultItem = {
  item: ItemID;
  components?: Record<string, any>;
};

export type ResultItemWithCount = ResultItem & {
  count?: number;
};

export type RecipeBookCategory = "blocks" | "misc";

export type BaseRecipe = {
  group?: string;
};

export type BaseCookingRecipe = BaseRecipe & {
  ingredient: IngredientItem | IngredientItem[];
  result: ResultItem;
  experience?: number;
  cookingTime?: number;
};

export type BlastingRecipe = BaseRecipe &
  BaseCookingRecipe & { type: "minecraft:blasting" };
export type CampfireCookingRecipe = BaseRecipe &
  BaseCookingRecipe & { type: "minecraft:campfire_cooking" };
export type SmeltingRecipe = BaseRecipe &
  BaseCookingRecipe & { type: "minecraft:smelting" };
export type SmokingRecipe = BaseRecipe &
  BaseCookingRecipe & { type: "minecraft:smoking" };

export type ShapedCraftingRecipe = BaseRecipe & {
  type: "minecraft:crafting_shaped";
  pattern: string[];
  key: Record<string, IngredientItem | IngredientItem[]>;
  result: ResultItemWithCount;
};

export type ShapelessCraftingRecipe = BaseRecipe & {
  type: "minecraft:crafting_shapeless";
  ingredients: IngredientItem[];
  result: ResultItemWithCount;
};

export type StoneCuttingRecipe = BaseRecipe & {
  type: "minecraft:stonecutting";
  ingredient: IngredientItem | IngredientItem[];
  result: ResultItemWithCount;
};

export type Recipe =
  | BlastingRecipe
  | CampfireCookingRecipe
  | SmeltingRecipe
  | SmokingRecipe
  | ShapedCraftingRecipe
  | ShapelessCraftingRecipe
  | StoneCuttingRecipe;

const ingredientItemSchema = z.object({
  item: z.string(),
  tag: z.string().optional(),
});

const resultItemSchema = z.object({
  item: z.string(),
  count: z.number().optional(),
  components: z.record(z.string(), z.unknown()).optional(),
});

export const recipeConfigSchema = z.object({
  recipe: z.union([
    z.object({
      type: z.literal("minecraft:blasting"),
      ingredient: z.union([
        ingredientItemSchema,
        z.array(ingredientItemSchema),
      ]),
      result: resultItemSchema,
      experience: z.number().optional(),
    }),
    z.object({
      type: z.literal("minecraft:campfire_cooking"),
      ingredient: z.union([
        ingredientItemSchema,
        z.array(ingredientItemSchema),
      ]),
      result: resultItemSchema,
      experience: z.number().optional(),
      cookingTime: z.number().optional(),
    }),
    z.object({
      type: z.literal("minecraft:smelting"),
      ingredient: z.union([
        ingredientItemSchema,
        z.array(ingredientItemSchema),
      ]),
      result: resultItemSchema,
      experience: z.number().optional(),
      cookingTime: z.number().optional(),
    }),
    z.object({
      type: z.literal("minecraft:smoking"),
      ingredient: z.union([
        ingredientItemSchema,
        z.array(ingredientItemSchema),
      ]),
      result: resultItemSchema,
      experience: z.number().optional(),
      cookingTime: z.number().optional(),
    }),
    z.object({
      type: z.literal("minecraft:crafting_shaped"),
      pattern: z.array(z.string()),
      key: z.record(
        z.string(),
        z.union([ingredientItemSchema, z.array(ingredientItemSchema)])
      ),
      result: resultItemSchema,
    }),
    z.object({
      type: z.literal("minecraft:crafting_shapeless"),
      ingredients: z.array(ingredientItemSchema),
      result: resultItemSchema,
    }),
    z.object({
      type: z.literal("minecraft:stonecutting"),
      ingredient: z.union([
        ingredientItemSchema,
        z.array(ingredientItemSchema),
      ]),
      result: resultItemSchema,
    }),
  ]),
  generate: z.function(),
  bundle: z.function(),
});

export function defineRecipe(name: string, recipe: Recipe) {
  return {
    recipe,
    generate: async (packConfig: PackConfig) => {
      const recipeDir = path.resolve(
        packConfig.generatedDir,
        "data",
        packConfig.namespace,
        "recipe"
      );
      await createDirectoryIfNotExists(recipeDir);
      await writeFile(
        path.resolve(recipeDir, `${name}.json`),
        JSON.stringify(recipe, null, 2),
        "utf-8"
      );
    },
    bundle: async (packConfig: PackConfig) => {
      const genRecipeDir = path.resolve(
        packConfig.generatedDir,
        "data",
        packConfig.namespace,
        "recipe"
      );
      const outRecipeDir = path.resolve(
        packConfig.outDir,
        "data",
        packConfig.namespace,
        "recipe"
      );
      await createDirectoryIfNotExists(outRecipeDir);
      await cp(
        path.resolve(genRecipeDir, `${name}.json`),
        path.resolve(outRecipeDir, `${name}.json`)
      );
    },
  };
}
