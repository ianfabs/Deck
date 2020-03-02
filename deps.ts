import * as _path from "https://deno.land/std/path/mod.ts";
export {
  serve,
  ServerRequest,
  Response,
  Server as IServer
} from "https://deno.land/std/http/server.ts";
export {
  Status,
  STATUS_TEXT
} from "https://deno.land/std/http/http_status.ts";
// export { parse } from "https://denolib.com/denolib/qs/mod.ts";
export const path = _path;
export { contentType } from "https://deno.land/std/media_types/mod.ts";
export { readFileStrSync , existsSync } from "https://deno.land/std/fs/mod.ts";
export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
export const compose = (...fns: any[]) => fns.reduceRight((f, g) => (...args: any) => g(f(...args)));
export const { decode } = decoder;
export const { encode } = encoder;
