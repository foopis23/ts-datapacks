import { existsSync } from "fs";
import { mkdir, readdir, stat, cp, readFile, writeFile } from "fs/promises";

export async function createDirectoryIfNotExists(directory: string) {
  if (!existsSync(directory)) {
    await mkdir(directory, { recursive: true });
  }
}

export async function copyRecursive(srcDir: string, destDir: string) {
  try {
    // Check if destination directory exists, create it if it doesn't
    try {
      await mkdir(destDir, { recursive: true });
    } catch (err) {
      console.error(`Error creating directory: ${err}`);
    }

    // Read all items (files and directories) in the source directory
    const items = await readdir(srcDir);

    for (const item of items) {
      try {
        const srcPath = `${srcDir}/${item}`;
        const destPath = `${destDir}/${item}`;

        const itemStat = await stat(srcPath);

        if (itemStat.isDirectory()) {
          // If the item is a directory, recursively copy it
          await copyRecursive(srcPath, destPath);
        } else if (itemStat.isFile()) {
          // If the item is a file, copy it to the destination
          await cp(srcPath, destPath);
        }
      } catch (err) {
        console.error(`Error copying item: ${srcDir}->${destDir} ${err}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function replaceStringInFile(
  filePath: string,
  variableMap: Record<string, string>
) {
  try {
    // Read the file
    let fileContent = await readFile(filePath, "utf8");

    // Replace all variables in the file content
    for (const [variable, value] of Object.entries(variableMap)) {
      fileContent = fileContent.replace(new RegExp(variable, "g"), value);
    }

    // Write the modified content back to the file
    await writeFile(filePath, fileContent);
  } catch (error) {
    console.error(`Error during string replacement: ${error}`);
  }
}

export async function replaceStringInTemplateFilesRecursive(
  dir: string,
  variableMap: Record<string, string>
) {
  try {
    const items = await readdir(dir);

    for (const item of items) {
      const itemPath = `${dir}/${item}`;
      const itemStat = await stat(itemPath);

      if (itemStat.isDirectory()) {
        // If the item is a directory, recursively replace strings in its contents
        await replaceStringInTemplateFilesRecursive(itemPath, variableMap);
      } else if (itemStat.isFile()) {
        // If the item is a file, replace strings in it
        await replaceStringInFile(itemPath, variableMap);
      }
    }
  } catch (error) {
    console.error(`Error during recursive string replacement: ${error}`);
  }
}
