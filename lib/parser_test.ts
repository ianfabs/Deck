import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import parse from "./urlparser.ts";

const unitTest = (t: string, r: string, exp: any) => {
  console.log(`templated => ${t}`);
  console.log(`requested => ${r}`);
  console.log(`requested => ${r}`);
  let res = parse(r, t);
  console.log(`result => ${JSON.stringify(res)}`);
  assertEquals(res, exp);
}

Deno.test({
  name: "Simple test",
  fn(): void {
    unitTest(
      "/users/:id",
      "/users/gAgFy2u1",
      {
        id: "gAgFy2u1"
      }
    );
  }
});

Deno.test({
  name: "Multiple variables",
  fn(): void {
    unitTest(
      "/records/:year/:month/:day",
      "/records/2020/03/08",
      {
        year: "2020",
        month: "03",
        day: "08",
      }
    );
  }
});

Deno.test({
  name: "Varying variables",
  fn(): void {
    unitTest(
      "/users/:username/profile/:page",
      "/users/rT6yU731bHi/profile/23",
      {
        username: "rT6yU731bHi",
        page: "23",
      }
    );
  }
});

Deno.test({
  name: "Slash at the end",
  fn(): void {
    unitTest(
      "/users/:username/",
      "/users/rT6yU731bHi/",
      {
        username: "rT6yU731bHi",
      }
    );
  }
});

Deno.test({
  name: "No Variables At All",
  fn(): void {
    unitTest(
      "/users/settings/advanced/experimental/enable",
      "/users/settings/advanced/experimental/enable",
      { }
    );
  }
});
