import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveSavedCanonical } from "./canonical.js";
import {
  buildRequestedPath,
  isSafeLocalPath,
  pickRedirectDestination,
} from "./redirectPath.js";

const SITE = "https://destinoway.com";

test("canonical: empty or invalid values fall back", () => {
  assert.equal(resolveSavedCanonical("", SITE), null);
  assert.equal(resolveSavedCanonical(undefined, SITE), null);
  assert.equal(resolveSavedCanonical("javascript:alert(1)", SITE), null);
  assert.equal(resolveSavedCanonical("//evil.com/x", SITE), null);
});

test("canonical: absolute and path values resolve", () => {
  assert.equal(
    resolveSavedCanonical("https://destinoway.com/canon", SITE),
    "https://destinoway.com/canon",
  );
  assert.equal(
    resolveSavedCanonical("/canon", SITE),
    "https://destinoway.com/canon",
  );
});

test("redirect: only safe local destinations are accepted", () => {
  assert.equal(isSafeLocalPath("/new-page"), true);
  assert.equal(isSafeLocalPath("//evil.com"), false);
  assert.equal(isSafeLocalPath("https://evil.com"), false);
  assert.equal(isSafeLocalPath("/a\\b"), false);
  assert.equal(pickRedirectDestination("/old", "/new"), "/new");
  assert.equal(pickRedirectDestination("/old", "https://evil.com"), null);
  assert.equal(pickRedirectDestination("/old", undefined), null);
});

test("redirect: self-redirect (loop) is rejected", () => {
  assert.equal(pickRedirectDestination("/old", "/old"), null);
  assert.equal(pickRedirectDestination("/Old/", "/old"), null);
});

test("requested path is encoded per segment", () => {
  assert.equal(buildRequestedPath("blog", "my post"), "/blog/my%20post");
  assert.equal(buildRequestedPath("hotels", "goa"), "/hotels/goa");
});

import {
  buildPageTitle,
  joinSiteUrl,
  normalizeSiteUrl,
} from "./seoUrl.js";

test("site url: trailing slashes and paths are normalized", () => {
  assert.equal(normalizeSiteUrl("https://a.com/"), "https://a.com");
  assert.equal(normalizeSiteUrl("https://a.com//"), "https://a.com");
  assert.equal(normalizeSiteUrl(""), "http://localhost:3000");
  assert.equal(joinSiteUrl("https://a.com/", "/my-page"), "https://a.com/my-page");
  assert.equal(joinSiteUrl("https://a.com//", "hotels", "/goa/"), "https://a.com/hotels/goa");
});

test("title: brand is not duplicated", () => {
  assert.deepEqual(buildPageTitle("myblog | Destinoway"), {
    absolute: "myblog | Destinoway",
  });
  assert.deepEqual(buildPageTitle("Goa | Destonoway"), {
    absolute: "Goa | Destonoway",
  });
  assert.equal(buildPageTitle("Goa Hotels"), "Goa Hotels");
  assert.equal(buildPageTitle(""), "Destonoway");
});

test("canonical: saved value wins even when it looks truncated", () => {
  assert.equal(
    resolveSavedCanonical("https://x.amplifyapp.com/my-", SITE),
    "https://x.amplifyapp.com/my-",
  );
});

test("canonical must be a string: Next replaces the path of URL instances", () => {
  const saved = resolveSavedCanonical("https://x.amplifyapp.com/my-", SITE);
  assert.equal(typeof saved, "string");
});
