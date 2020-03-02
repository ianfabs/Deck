/* Imports */
import { Response as __response_interface__, compose, encode, decode } from "./deps.ts";
import { Context } from "./context.ts";

/* Namespaces */
namespace Route {
  export type Path = string;
  export interface Handler {
    (context: Context): Promise<void> | void
  };
  export interface Middleware {
    (this: void, context: Context): Context
  };
  export function isMiddleware(thing: any): thing is Middleware {
    return <Middleware>thing && !!<ReturnType<Middleware>>(new Context({})) && typeof thing === 'function';
  }
  export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    HEAD = "HEAD",
    PATCH = "PATCH"
  }
  export namespace Method {
    export function* values() {
      yield Method.GET;
      yield Method.POST;
      yield Method.PUT;
      yield Method.DELETE;
      yield Method.HEAD;
      yield Method.PATCH;
    }
  }
  export class IMap extends Map<Route.Method, Map<Route.Path, Route.Handler>> {
    constructor() {
      super();
      for (const method of Route.Method.values()) {
        this.set(method, new Map<Route.Path, Route.Handler>())
      }
    }
    /* add(method: Route.Method, path: Route.Path, handler: Route.Handler) {
      this.get(method).set(path, handler);
    } */
    add(method: Route.Method, path: Route.Path, ...fns: any[]) {
      this.get(method)?.set(path, compose(...fns.reverse()));
    }
  }
}

namespace Deck {
  export namespace Errors {
    // Generic Error, mostly for when you don't know what kind if
    // error it would be.
    export class Generic extends globalThis.Error {
      constructor(message: string) {
        super(message);
        this.name = "Deck Error: ";
      }
    }
    // For lazy custom errors, because I have homework to do but I want to keep working on this
    export function makeDeckError(err: globalThis.Error) {
      err.name = "Deck Error: " + err.name;
      return err;
    }
  }
  export var __dirname = Deno.cwd();

}

/* Enums */
enum Status {
  Ok = 200,
  Created = 201,
  MovedPermanently = 301,
  Found = 302,
  NotModified = 304,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Gone = 410,
  Teapot = 418,
  Locked = 423,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
}

/* Interfaces */
interface IServerConfig {
  // Definitely keeping these
  port: number
  address: string
  // Proposed
  // replaceSingleSlash?: boolean,
}
interface IRouter {
  get: (path: Route.Path, ...fns: any[]) => void
  post: (path: Route.Path, ...fns: any[]) => void
  put: (path: Route.Path, ...fns: any[]) => void
  delete: (path: Route.Path, ...fns: any[]) => void
}

/* Classes */

// TODO: Create response that encodes and decodes body by default
class Response implements __response_interface__ {
  private __body: any;
  get body() {
    return decode(this.__body);
  }
  set body(val) {
    this.__body = encode(val);
  }
}

export { Deck, Route, Status, IServerConfig, IRouter }
