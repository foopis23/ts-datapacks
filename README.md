# ts-datapacks

ts-datapacks is a TypeScript library for creating Minecraft datapack. It started out as just some cobbled together scripts for a data pack I was making, but I decided I wanted to make it into a library to use on future projects.

## Benefits

- Type safe interface for creating Minecraft data packs
- No need to learn a new language or syntax

## Features

- [x] mcfunction generation (for doing macro like operations in mcfunction files)
- [ ] Syntax highlighting for embedded mcfunction strings
- [ ] Type safe recipe definitions
- [ ] Type safe dimension definitions
- [ ] Type safe loot table definitions
- [ ] Type safe advancement definitions
- [ ] Type safe structure definitions
- [ ] Type safe tag definitions

## Getting Started

### Requirements

- bun (https://bun.sh/docs/installation)

### Create New Project

```bash
bun add -g https://github.com/foopis23/ts-datapacks
bux tsmc init <project-name> # this will create a new directory named ./<project-name> and create the initial project in there
```
