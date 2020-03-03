import {Server, Context} from "../../mod.ts";
import parse from "hbs";

let app = new Server();
app.set("view_engine", parse);

app.get("/", ( context: Context ) => {
	context.render("./views/index.hbs", {title: "Deck", name: "World"});
});

app.get("/:name", (ctx: Context) => {
  let {name} = ctx.routeParams;
  ctx.render("./views/index.hbs", {title: "Deck", name});
})

/* The default port is 4000*/
app.listen();
