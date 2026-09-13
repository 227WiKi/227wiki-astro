import { resourceBaseUrl } from "@/config/site";

/** Resolve a relative resource path under the site's resource origin. */
export function resourceUrl(path: string): string {
  return new URL("./" + path.replace(/^\/+/, ""), resourceBaseUrl + "/").href;
}
