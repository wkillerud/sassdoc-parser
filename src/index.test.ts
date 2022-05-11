import { hello } from "./index";

test("greets the world", () => {
  expect(hello).toBe("world");
});
