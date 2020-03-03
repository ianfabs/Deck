import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import parse from "./urlparser.ts";

const template_url = "/users/:id";

const requested_url = "/users/gAgFy2u1";

let r = parse(requested_url, template_url);

console.log(r);

const unitTest = (t: string, r: string, exp: any) => {
  console.log(`templated => ${t}`);
  console.log(`requested => ${r}`);
  let res = parse(r, t);
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
