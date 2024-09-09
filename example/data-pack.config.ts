import {
  datapack,
  command,
  type Function,
  type ItemID,
  type Recipe,
} from "../index";

// you can define variables and use them in the config.
const name = "example datapack";
const starterItemList: ItemID[] = [
  "minecraft:stone_sword",
  "minecraft:stone_pickaxe",
  "minecraft:stone_axe",
  "minecraft:stone_shovel",
];

/**
 * example of defining functions externally.
 *
 * You could export this from any file and import it here. After building, 
 * see ts-datapack-example/data/ts-datapack-example/function/giveStarterItems.mcfunction 
 * to see what this builds to
 */
const giveStarterItems: Function = {
  command: command`${starterItemList.map((item) => command`give @s ${item}`)}`,
};

/**
 * example of defining recipes externally.
 *
 * You could export this from any file and import it here. After building, 
 * see ts-datapack-example/data/ts-datapack-example/recipe/external_recipe.json 
 * to see what this builds to
 */
const easyDiamondRecipe: Recipe = {
  type: "minecraft:crafting_shapeless",
  ingredients: ["minecraft:dirt"],
  result: {
    id: "minecraft:diamond",
    count: 64,
  },
};

export default datapack({
  defaultNamespace: "ts-datapack-example", // the default namespace for all datapack data
  outDir: "ts-datapack-example",
  functions: {
    // the key is the name of the function file
    hello_world: {
      namespace: "another-namespace", // you can override the default namespace for any piece of data
      command: command`say "Hello, ${name}!"`,
    },
    giveStarterItems: giveStarterItems,
  },
  recipes: {
    // the key is the name of the recipe file
    easy_diamonds: easyDiamondRecipe,
    shaped_test: {
      type: "minecraft:crafting_shaped",
      pattern: ["AAA", "ABA", "AAA"],
      key: {
        A: ["minecraft:cobblestone", "minecraft:cobbled_deepslate"],
        B: "minecraft:stick",
      },
      result: {
        id: "minecraft:sponge",
      },
    },
    blasting_test: {
      type: "minecraft:blasting",
      ingredient: "minecraft:sponge",
      result: {
        id: "minecraft:cobbled_deepslate",
      },
    },
    campfire_cooking_test: {
      type: "minecraft:campfire_cooking",
      ingredient: "minecraft:sponge",
      result: {
        id: "minecraft:cobbled_deepslate",
      },
      experience: 0.35,
      cookingTime: 1,
    },
    smelting_test: {
      type: "minecraft:smelting",
      ingredient: "minecraft:sponge",
      result: {
        id: "minecraft:cobbled_deepslate",
      },
      experience: 0.35,
      cookingTime: 1,
    },
    smoking_test: {
      type: "minecraft:smoking",
      ingredient: "minecraft:sponge",
      result: {
        id: "minecraft:cobbled_deepslate",
      },
      experience: 0.35,
      cookingTime: 1,
    },
    stonecutting_test: {
      type: "minecraft:stonecutting",
      ingredient: "minecraft:sponge",
      result: {
        id: "minecraft:cobbled_deepslate",
      },
    },
  },
});
