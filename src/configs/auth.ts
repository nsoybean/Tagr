import { apiEventsEmitter } from "@/events/events";
import { storage } from "@/lib/storage";
import { User } from "@/typings/user/types";

export const APP_AUTH_TOKEN_NAME = "authToken";
export const APP_AUTH_USER_NAME = "authUser";

export let authToken = storage.get(APP_AUTH_TOKEN_NAME) as string | undefined;

export function setAuthToken(token: string): void {
  authToken = token;
  storage.set(APP_AUTH_TOKEN_NAME, token);
  apiEventsEmitter.emit("authToken.set");
}

export function setUserInfo(userInfo: User): void {
  storage.set(APP_AUTH_USER_NAME, JSON.stringify(userInfo));
  apiEventsEmitter.emit("authUser.set");
}

export function getAuthToken(): string | undefined {
  return authToken;
}

export function clearAuthToken(): void {
  authToken = undefined;
  storage.remove(APP_AUTH_TOKEN_NAME);
  apiEventsEmitter.emit("authToken.clear");
}

export function removeLocalUserData(): void {
  authToken = undefined;
  storage.clear();
  apiEventsEmitter.emit("authToken.clear");
}

// This handler will run on other tabs (not the active one calling API functions),
// and will ensure they know about auth token changes.
// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
// "Note: This won't work on the same page that is making the changes — it is really a way
// for other pages on the domain using the storage to sync any changes that are made."
window.addEventListener("storage", (event) => {
  if (event.key === storage.getPrefixedKey(APP_AUTH_TOKEN_NAME)) {
    if (!!event.newValue) {
      authToken = event.newValue;
      apiEventsEmitter.emit("authToken.set");
    } else {
      authToken = undefined;
      apiEventsEmitter.emit("authToken.clear");
    }
  }
});
