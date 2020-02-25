/*
 Just some notes, probably gunna need the following:
 - fs
 - http
 - path

 I will need to create several different classes:
 - Server
 - Router
 - RouteHandler

 Router and Server will be almost the same, except that Server will implement a listening method.
 RouteHandler will store:
 - The function that handles a route
 - The HTTP verb of the route.

 I was thinking either:
 A.) A Router stores a Map like key => route path, value => RouteHandler
 B.) the map is like: key => HTTP Verb and value => RouteHandler + .route field to store the path

 Let's try A first
*/

export * from "./context.ts";
export * from "./router.ts";
export * from "./server.ts";
export * from "./types.ts";
