import { runBenchmarks, bench } from "https://deno.land/std/testing/bench.ts";
import parse from "./urlparser.ts";

bench({
  name: "Parser performance 100X",
  runs: 5000,
  func(b): void {
    let r = "/users/brad", t = "/users/:name";
    b.start();
    parse(r, t);
    b.stop();
  }
});

runBenchmarks();
