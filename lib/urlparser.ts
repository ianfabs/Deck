// @param requested - The URL of the request
// @param template  - The template url path
export const parse = function(requested: string, template: string) {
  // segs means segments as in URL segments
  // let routeParams: any = new Map<string, string>();
  let routeParams: any = {};
  let segs: any = tokenize(requested), templates: any = tokenize(template);

  for (let i = 0; i < templates.size; i++) {
    let stoken = segs.get(i);
    let ttoken = templates.get(i);

    if (ttoken.type == "template" && stoken?.token != null) routeParams[ttoken.token] = stoken.token;
  }
  return routeParams;
};

interface IToken {
  "type": 'template' | 'path'
  token: string
}

namespace Token {
  export const deep_equals = (t1: IToken, t2: IToken): boolean => {
    return t1["type"] == t2["type"] && t1["token"] == t2["token"];
  };
  export const new_token: () => IToken = () => ({"type": "path", "token": ""});
}

export const tokenize = (url: string) => {
  let url_chars: string[] = [...url];

  let tokens: any = new Map<string, IToken>();
  let token: IToken = Token.new_token();

  top: for (let i = 0; i < url_chars.length; i++) {
    let p = url_chars[i-1];
    let c = url_chars[i];
    let n = url_chars[i+1];

    switch (c) {
      case '/': {
        if (p != null) {
          tokens.set(tokens.size, token);
          token = Token.new_token();
        }
        break;
      }
      case ':': {
        token.type = "template";
        break;
      }
      default: {
        token.token += c;
        if (n == null) {
          tokens.set(tokens.size, token);
        }
        break;
      }
    }
    continue top;
  }
  return tokens;
}

export default parse;
