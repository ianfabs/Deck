import {Server, Context} from "../../mod.ts";
import parse from "hbs";

let app = new Server();
app.set("view_engine", parse);

app.get("/", ( context: Context ) => {
	context.render("./views/index.hbs", {title: "Deck", name: "Ian"});
});

app.post("/", async ( context: Context ) => {
  let results: Record<string, unknown> = await context.body() as Record<string, unknown>;
	context.render("./views/results.ejs", {title: "Deck", name: "Ian", ...results});
})

/* The default port is 4000*/
app.listen();
