import { tokenize } from "./urlparser.ts";

const requested_url = "/users/:id";

console.log(requested_url);
let r = tokenize(requested_url);

console.log(r);
