import { ServerRequest, compose, path } from "./deps.ts";
import { Route, IRouter } from "./types.ts";
import {parse} from "./lib/urlparser.ts";
import { equal } from "https://deno.land/std/testing/asserts.ts";

// request and result need their own types. next needs it's own type too


class Router/*  implements IRouter */ {
  public prefix: Route.Path;
  public routes: Route.IMap = new Route.IMap();
  public middleware: Route.Middleware[] = new Array<Route.Middleware>();

  constructor(prefix?: Route.Path) {
    this.prefix = prefix ?? "";
  }

  /*
  I would like to find a pattern that works for these. I feel this thick-ass block of repetitive code
  is doing nobody any favors. Possible ideas are:
  - make Router an object
  - make Router a function
  - use Proxy on object
  - use Object.defineProperty(obj, prop, config) within function

    It's been... well time has passed. I now see that while novel, doing any of the above would
    make my code human-unfriendly.
  */
  get(__path: Route.Path, ...fns: any[]) {
    this.routes.add(Route.Method.GET, path.posix.join(this.prefix, __path), ...this.middleware, ...fns);
  }
  post(__path: Route.Path, ...fns: any[]): void {
    this.routes.add(Route.Method.POST, path.posix.join(this.prefix, __path), ...this.middleware, ...fns);
  }
  put(__path: Route.Path, ...fns: any[]): void {
    this.routes.add(Route.Method.PUT, path.posix.join(this.prefix, __path), ...this.middleware, ...fns);
  }
  delete(__path: Route.Path, ...fns: any[]): void {
    this.routes.add(Route.Method.DELETE, path.posix.join(this.prefix, __path), ...this.middleware, ...fns);
  }

  use(...args: Route.Middleware[] | [Router] | [Route.Path, Router]) {
    // if the only arg is a Router
    if (args[0] instanceof Router) {
      for (const [method, map] of args[0].routes.entries()) {
        map.forEach((handler, path) => {
          this.routes.get(method)?.set(path, handler);
        })
      }
    }
    // if the first arg is a path prefix, and the second is a Router
    else if (typeof args[0] == 'string' && args[1] instanceof Router) {
      let [prefix, router] = args;
      for (const [method, map] of router.routes.entries()) {
        map.forEach((__handler, __path) => {
          this.routes.get(method)?.set(path.posix.join(prefix, __path), __handler);
        })
      }
    }
    // If args are an array of middlewares
    else if (args.every(Route.isMiddleware) ) {
      ( args as Route.Middleware[] ).forEach((fn: Route.Middleware) => { this.middleware.push(fn) });
    }
    // Throw an error if none of the following conditions work
    else throw new Error("Supplied arguments do not match the allowed types");
  }
  
  // Lookup template route
  lookup(method: Route.Method, requested_url: string) {
    let routesForMethod = this.routes.get(method)!;
    let handler = routesForMethod?.get(requested_url);
    let success = false;
    let routeParams = null;
    // Loop stuff
    let keys = routesForMethod.keys();    
    for (const key of keys) {
      let psd = parse(requested_url, key);
      if (!equal(psd, {})) {
        // yay we have a match!
        // return routesForMethod!.get(key)
        routeParams = psd;
        handler = routesForMethod!.get(key);
      }
    }
    success = !!handler;
    return [ success, handler, routeParams ];
  }
}

export default Router;
export { Router };
