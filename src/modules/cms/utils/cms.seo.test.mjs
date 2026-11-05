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
  getRobotsMetadata,
  getSiteUrl,
  isIndexableSite,
  joinSiteUrl,
  normalizeSiteUrl,
} from "./seoUrl.js";

const withEnvironment = (values, callback) => {
  const keys = Object.keys(values);
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  try {
    callback();
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
};

test("SEO environment: only aligned production origins are indexable", () => {
  withEnvironment(
    {
      NODE_ENV: "production",
      DEPLOYMENT_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://destinoway.com",
      NEXTAUTH_URL: "https://destinoway.com",
    },
    () => {
      assert.equal(isIndexableSite(), true);
      assert.equal(getRobotsMetadata().index, true);
      assert.equal(getSiteUrl(), "https://destinoway.com");
    },
  );
});

test("SEO environment: staging and mismatched origins fail closed", () => {
  withEnvironment(
    {
      NODE_ENV: "production",
      DEPLOYMENT_ENV: "staging",
      NEXT_PUBLIC_SITE_URL: "https://dev.destinoway.com",
      NEXTAUTH_URL: "https://dev.destinoway.com",
    },
    () => {
      assert.equal(isIndexableSite(), false);
      assert.equal(getRobotsMetadata().index, false);
      assert.equal(getSiteUrl(), "https://dev.destinoway.com");
    },
  );

  withEnvironment(
    {
      NODE_ENV: "production",
      DEPLOYMENT_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://destinoway.com",
      NEXTAUTH_URL: "https://dev.destinoway.com",
    },
    () => {
      assert.equal(isIndexableSite(), false);
      assert.equal(getSiteUrl(), "https://destinoway.com");
    },
  );

  withEnvironment(
    {
      NODE_ENV: "production",
      DEPLOYMENT_ENV: "staging",
      NEXT_PUBLIC_SITE_URL: "https://dev.destinoway.com",
      NEXTAUTH_URL: "https://destinoway.com",
    },
    () => {
      assert.equal(isIndexableSite(), false);
      assert.equal(getSiteUrl(), "https://dev.destinoway.com");
    },
  );
});

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
  assert.equal(buildPageTitle(""), "Destinoway");
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
