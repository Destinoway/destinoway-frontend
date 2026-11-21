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

test("SEO environment: APP_ENV=production is indexable with production origin", () => {
  withEnvironment(
    {
      NODE_ENV: "production",
      APP_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://www.destinoway.com",
      NEXTAUTH_URL: "https://destinoway.com",
    },
    () => {
      assert.equal(isIndexableSite(), true);
      const robots = getRobotsMetadata();
      assert.equal(robots.index, true);
      assert.equal(robots.follow, true);
      assert.equal(robots.googleBot.index, true);
      assert.equal(robots.googleBot.follow, true);
      assert.equal(getSiteUrl(), "https://destinoway.com");
    },
  );
});

test("SEO environment: page-level noindex still wins in production", () => {
  withEnvironment(
    { NODE_ENV: "production", APP_ENV: "production", NEXTAUTH_URL: "https://destinoway.com" },
    () => {
      const robots = getRobotsMetadata({ noindex: true });
      assert.equal(robots.index, false);
      assert.equal(robots.googleBot.index, false);
    },
  );
});

test("SEO environment: development and UAT are noindex, nofollow", () => {
  for (const [appEnv, origin] of [
    ["development", "https://dev.destinoway.com"],
    ["uat", "https://uat.destinoway.com"],
  ]) {
    withEnvironment(
      {
        NODE_ENV: "production",
        APP_ENV: appEnv,
        NEXT_PUBLIC_SITE_URL: origin,
        NEXTAUTH_URL: origin,
      },
      () => {
        assert.equal(isIndexableSite(), false);
        const robots = getRobotsMetadata();
        assert.equal(robots.index, false);
        assert.equal(robots.follow, false);
        assert.equal(robots.googleBot.index, false);
        assert.equal(robots.googleBot.follow, false);
        assert.equal(getSiteUrl(), origin);
      },
    );
  }
});

test("SEO environment: misconfiguration fails closed", () => {
  // Missing / unknown APP_ENV
  for (const appEnv of ["", "prod", "staging"]) {
    withEnvironment(
      { NODE_ENV: "production", APP_ENV: appEnv, NEXTAUTH_URL: "https://destinoway.com" },
      () => assert.equal(isIndexableSite(), false),
    );
  }

  // APP_ENV=production copied onto a UAT branch
  withEnvironment(
    {
      NODE_ENV: "production",
      APP_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://uat.destinoway.com",
      NEXTAUTH_URL: "https://uat.destinoway.com",
    },
    () => {
      assert.equal(isIndexableSite(), false);
      // Canonicals still never point at UAT when APP_ENV=production
      assert.equal(getSiteUrl(), "https://destinoway.com");
    },
  );

  // Non-production env must not resolve to the production origin
  withEnvironment(
    {
      NODE_ENV: "production",
      APP_ENV: "uat",
      NEXT_PUBLIC_SITE_URL: "https://destinoway.com",
      NEXTAUTH_URL: "https://uat.destinoway.com",
    },
    () => assert.equal(getSiteUrl(), "https://uat.destinoway.com"),
  );

  // next dev is never indexable
  withEnvironment(
    { NODE_ENV: "development", APP_ENV: "production", NEXTAUTH_URL: "https://destinoway.com" },
    () => assert.equal(isIndexableSite(), false),
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

import { hasCmsContent, isCmsPageIndexable } from "./cmsIndexing.js";

test("cms indexing: empty standalone pages are excluded", () => {
  // Shape of the test entries in the CMS (e.g. /df, /dasdss): no blocks, no content.
  const empty = { slug: "df", entityType: "blog", isPublished: true, data: { cityMeta: {} } };
  assert.equal(hasCmsContent(empty), false);
  assert.equal(isCmsPageIndexable(empty), false);
  assert.equal(isCmsPageIndexable({ ...empty, entityType: "static", data: { blocks: [] } }), false);
  assert.equal(isCmsPageIndexable({ ...empty, data: { content: "<p>&nbsp;</p>" } }), false);
});

test("cms indexing: published pages with content stay indexable", () => {
  const page = {
    slug: "privacy-policy",
    entityType: "static",
    isPublished: true,
    data: { blocks: [{ type: "content", data: { content: "<p>Policy</p>" } }] },
  };
  assert.equal(isCmsPageIndexable(page), true);
  assert.equal(isCmsPageIndexable({ slug: "x", entityType: "static", data: { content: "<p>Legacy</p>" } }), true);
});

test("cms indexing: listing pages never count as empty", () => {
  for (const entityType of ["hotel", "hotelCity", "city"]) {
    assert.equal(isCmsPageIndexable({ slug: "goa", entityType, isPublished: true, data: {} }), true);
  }
});

test("cms indexing: draft, unpublished and noindex flags are excluded", () => {
  const base = { slug: "p", entityType: "static", data: { blocks: [{ type: "content" }] } };
  assert.equal(isCmsPageIndexable({ ...base, isPublished: false }), false);
  assert.equal(isCmsPageIndexable({ ...base, status: "draft" }), false);
  assert.equal(isCmsPageIndexable({ ...base, noindex: true }), false);
  assert.equal(isCmsPageIndexable({ ...base, isIndexable: false }), false);
  assert.equal(isCmsPageIndexable({ ...base, robots: { index: false } }), false);
  assert.equal(isCmsPageIndexable(null), false);
});
