import { Router } from "./router.ts";
import { IServer, serve, ServerRequest, path } from "./deps.ts";
import { Context } from "./context.ts";
import { Route, IServerConfig } from "./types.ts";

export let defaultServerConfig: IServerConfig = {
  port: 4000,
  address: "localhost"
}

// Server
export class Server extends Router {
  // @ts-ignore
  public __server: IServer;
  public config: IServerConfig;

  get port() {
    return this.config.port;
  }
  get address() {
    return this.config.address;
  }
  get url() {
    return "http://" + (this.port ? this.address + ":" + this.port : this.address) + "/";
  }

  constructor(config: Partial<IServerConfig> = {}) {
    super("/");
    // This will fill in any missing fields
    this.config = Object.assign(
      defaultServerConfig,
      config
    );
  }

  set(type: string, v: any) {
    switch (type) {
      case "view_engine": { Context.renderer = v; break; }
    }
  }

  async listen() {
    this.__server = serve({ port: this.port });
    console.log("Sever available @ " + this.url);
    for await (const request of this.__server) {
      let context = new Context(request);
      console.info(`${request.method} "${request.url}"`);

      const [success, handler, params ] = this.lookup(request.method as Route.Method, request.url as string);
      context.routeParams = params;

      // console.info(`success => ${success}`)
      // console.info(`routeParams => ${rprms}`)

      if (success) {
        handler(context);
      }
    }
  }
}
