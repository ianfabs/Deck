import { Server, Route } from "../mod.ts";
import parse from "hbs";
import apiRouter from "./api.router.ts";
let app = new Server();

const mitm: Route.Middleware = context => Object.assign(context, {dog: true});

app.set("view_engine", parse);
app.use(apiRouter);
app.use(mitm);


app.get("/", (ctx) => {
  ctx.sendFile("./tests/index.html");
})

app.get("/hello", (ctx) => {
  ctx.send("hello");
});

app.post("/echo", async (ctx) => {
  ctx.send(JSON.stringify(await ctx.body()));
});

app.get("/test", (ctx) => {
  ctx.render("./tests/test.hbs", {name: ctx.dog ? "Dog" : "Ian"});
})

app.listen(4000);
