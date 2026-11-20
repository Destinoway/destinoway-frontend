import { getSession } from "next-auth/react";

let cachedSession = null;
let hasCachedSession = false;
let sessionRequest = null;

export const setCachedSession = (session) => {
  cachedSession = session;
  hasCachedSession = true;
};

const fetchSession = () => {
  if (!sessionRequest) {
    sessionRequest = getSession()
      .then((session) => {
        setCachedSession(session);
        return session;
      })
      .finally(() => {
        sessionRequest = null;
      });
  }

  return sessionRequest;
};

export const getCachedSession = () =>
  hasCachedSession ? Promise.resolve(cachedSession) : fetchSession();

export const refreshCachedSession = () => fetchSession();

export const clearCachedSession = () => {
  setCachedSession(null);
};
