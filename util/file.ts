import { existsSync } from "fs";
import { mkdir, readdir, stat, cp } from "fs/promises";

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
    }
  } catch (error) {
    console.error(`Error during recursive copy: ${error}`);
  }
}
