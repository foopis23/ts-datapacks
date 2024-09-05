import { packConfig, functionConfig, command } from "ts-datapacks";

const name = "$project-name";

export default packConfig({
  namespace: "$project-name",
  functions: [
    functionConfig({
      name: "hello_world",
      command: command`
        say "Hello, ${name}!"
      `,
    }),
  ],
});
