import { AuthUser, User } from "../typings/user/types";

export function parseAuthFromRedirectUrl(hashUrl: string): AuthUser {
  const parsedToken = parseTokenFromUrl(hashUrl);
  return parsedToken;
}

function parseTokenFromUrl(urlHash: string): AuthUser {
  const fragments = urlHash.substring(urlHash.indexOf("#") + 1);
  const params = new URLSearchParams(fragments);

  const token = params.get("access_token");
  const token_type = params.get("token_type");
  const email = params.get("email");
  const picture = params.get("picture");

  const result: AuthUser = {
    email: email ?? "",
    accessToken: token ?? "",
    tokenType: token_type ?? "",
    picture: picture ?? "",
  };
  return result;
}

export function getFallbackName(user: User): string {
  let name = "";
  if (user.firstName) {
    name += user.firstName[0].toUpperCase();
  }
  if (user.lastName) {
    name += user.lastName[0].toUpperCase();
  }

  return name;
}
