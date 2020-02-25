import { Router } from "../mod.ts";
const router = new Router("/api");

router.get("/", (ctx) => {
  ctx.render("./tests/test.hbs", {name: "API"});
});

router.get("/hello", (ctx) => {
  ctx.send("hello");
});

router.get("/redirect", (ctx) => {
  ctx.redirect("http://localhost:4000/hello");
})

export default router
