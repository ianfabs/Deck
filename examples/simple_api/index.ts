import {Server} from "../../mod.ts";
import {render} from "https://deno.land/x/dejs@0.3.4/mod.ts";

let app = new Server();
app.set("view_engine", render);

app.get("/", context => {
	context.render("./views/index.ejs", {title: "Deck", name: "Ian"});
});

app.post("/", async context => {
	let results = await context.body();
	context.render("./views/results.ejs", {title: "Deck", name: "Ian", ...results});
})

/* The default port is 4000*/
app.listen();
