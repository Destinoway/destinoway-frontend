// Same contract as the backend: a single leading "/", no protocol-relative or backslash forms.
const SAFE_PATH = /^\/(?!\/)[^\s\\]*$/;

export const isSafeLocalPath = (value) =>
  typeof value === "string" && value.length <= 2048 && SAFE_PATH.test(value);

const stripQueryAndHash = (value) => String(value).split(/[?#]/)[0];

const normalize = (value) => {
  const path = stripQueryAndHash(value).toLowerCase();
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

// Returns the destination path only when it is local and does not point back at the request.
export const pickRedirectDestination = (requestedPath, location) => {
  if (!isSafeLocalPath(location)) return null;
  if (normalize(location) === normalize(requestedPath)) return null;
  return location;
};

export const buildRequestedPath = (...segments) =>
  `/${segments
    .filter((segment) => typeof segment === "string" && segment)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
