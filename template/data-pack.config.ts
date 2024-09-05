import { packConfig, functionConfig, command } from "ts-datapacks";

const name = "$name";

export default packConfig({
  namespace: "cool_points",
  functions: [
    functionConfig({
      name: "hello_world",
      command: command`
        say "Hello, ${name}!"
      `,
    }),
  ],
});
