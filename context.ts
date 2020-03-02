import {
  ServerRequest,
  Response,
  path,
  readFileStrSync,
  existsSync,
  contentType,
  encoder,
  decoder,
} from "./deps.ts";
import { Route, Status, Deck } from "./types.ts";

type ResponseBody = Pick<Response, 'body'>['body'];

export class Context {
  public request: ServerRequest;
  public response: Response = {};
  public headers: Headers = new Headers();
  // @ts-ignore
  private _url: URL;
  public static renderer: (str: string, ctx: any) => string;

  set url(v: string | URL) {
    this._url = v instanceof URL ? v : new URL(v);
  }
  get url() {
    return this._url;
  }

  get queryParams(): URLSearchParams {
    return this._url.searchParams;
  }

  get path(): string {
    return this._url.pathname;
  }

  get method(): string {
    return this.request.method;
  }

  constructor(__request: any) {
    this.request = __request;
    this.response.headers = new Headers();
  }

  // A simple way to overwrite the headers for the current context's response
  protected writeResponseHeaders(headers: Record<string, string>) {
    this.response.headers = new Headers(headers);
  }
  // In the future, this should handle Uint8Array and Deno.Reader. Though, this will suffice for now
  protected writeResponseBody(body: ResponseBody, encodeBody: boolean = true) {
    this.response.body = encodeBody && typeof body == 'string' ? encoder.encode(body) : body;
  }
  // Set the Content-Type header for the current context's response
  protected writeResponseContentType(contentType: string) {
    this.response.headers?.set("Content-Type", contentType);
  }
  // Set the response status code
  protected writeResponseStatus(status: number | Status = Status.Ok) {
    this.response.status == status;
  }

  protected respond({ body, status, contentType }: Partial<Response> & { contentType?: string } = {}) {
    /* if (body !== null && status !== null && contentType !== null) {
      this.writeResponseBody(body);
      this.writeResponseStatus(status)
      this.writeResponseContentType(contentType);
    } */
    body && this.writeResponseBody(body);
    status && this.writeResponseStatus(status);
    contentType && this.writeResponseContentType(contentType);
    this.request.respond(this.response);
  }

  /* protected respond() {
    this.request.respond(this.response);
  } */

  send(body: string) {
    this.respond({
      body,
      status: Status.Ok,
      contentType: contentType("text")
    });
  }

  private readFile(__path: Route.Path) {
    // Get full path to file
    const filePath: string = path.join(Deno.cwd(), __path);
    // Check if file exists
    if (existsSync(filePath)) {
      const fileContents: string = readFileStrSync(filePath, { encoding: "utf8" });
      return fileContents;
    } else {
      throw new Deck.Errors.Generic(`File at \"${filePath}\" was not found.`)
    }
  }

  sendFile(__path: string) {
    let __body, __status, __contentType;
    // The *file* in question here is the file to be sent to the user
    try {
      let file: string = this.readFile(__path);
      __contentType = contentType(path.extname(__path));
      __status = Status.Ok;
      __body = this.readFile(__path);
    } catch (error) {
      __contentType = "text/html";
      __status = Status.NotFound;
      __body = error.toString();
    }
    // TODO: Should this be in the 'try' block? in a 'finally' block? or is this fine?
    this.respond({body: __body, status: __status, contentType: __contentType});
  }

  render(__path: string, rendererContext: any) {
    let body, status, contentType = "text/html";
    try {
      let file: string = this.readFile(__path);
      status = Status.Ok;
      body = Context.renderer(file, rendererContext);
    } catch (error) {
      status = Status.NotFound;
      body = error.toString();
    }
    this.respond({body, status, contentType});
  }

  json(__json: object) {
    this.respond({
      body: JSON.stringify(__json),
      status: Status.Ok,
      contentType: "application/json"
    });
  }

  redirect(location: Route.Path) {
    // this.response.headers.set("Location", location);
    this.writeResponseHeaders({ "Location": location });
    this.respond({status: Status.MovedPermanently});
  }

  async body(): Promise<Record<string, unknown> | string> {
    const request_body = decoder.decode(await Deno.readAll(this.request.body));
    const mime = this.request.headers?.get("Content-Type") ?? "text";
    if (mime.includes("json")) return JSON.parse(request_body);
    else return request_body;
  }
}
