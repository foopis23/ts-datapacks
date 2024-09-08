import { datapack, command, type Function, type ItemID } from "../index";

// you can embedded your functions and recipes right into the config, or you can import them from another file

const name = "example datapack";

/*
 * example of defining functions externally.
 *
 * You could export this from any file and import it here.
 * 
 * After building, see ts-datapack-example/data/ts-datapack-example/function/external_function.mcfunction to see what this builds to
 */
const itemList: ItemID[] = [
  "minecraft:stone_sword",
  "minecraft:stone_pickaxe",
  "minecraft:stone_axe",
  "minecraft:stone_shovel",
];
const giveStarterItems: Function = {
  command: command`${itemList.map((item) => command`give @s ${item}`)}`,
};

export default datapack({
  namespace: "ts-datapack-example",
  outDir: "ts-datapack-example",
  functions: {
    hello_world: {
      command: command`say "Hello, ${name}!"`,
    },
    external_function: giveStarterItems,
  },
  recipes: {
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
    shapeless_test: {
      type: "minecraft:crafting_shapeless",
      ingredients: ["minecraft:dirt"],
      result: {
        id: "minecraft:sponge",
        count: 64,
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
