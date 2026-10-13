let accessToken: string | null = null;
let authFailureHandler: (() => void) | null = null;
export const authToken = {
  get: () => accessToken,
  set: (token: string | null) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
  setAuthFailureHandler: (handler: () => void) => {
    authFailureHandler = handler;
  },
  handleAuthFailure: () => {
    authFailureHandler?.();
  },
};