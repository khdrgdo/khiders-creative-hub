import { queryOptions } from "@tanstack/react-query";
import { getContent, getHomeContent, getPage, getSite, listContent } from "./public.functions";
import type { ContentType } from "./site-types";

export const siteQuery = queryOptions({ queryKey: ["site"], queryFn: () => getSite() });
export const homeContentQuery = queryOptions({ queryKey: ["home-content"], queryFn: () => getHomeContent() });
export const listQuery = (type: ContentType) =>
  queryOptions({ queryKey: ["list", type], queryFn: () => listContent({ data: { type } }) });
export const itemQuery = (type: ContentType, slug: string) =>
  queryOptions({ queryKey: ["item", type, slug], queryFn: () => getContent({ data: { type, slug } }) });
export const pageQuery = (slug: string) =>
  queryOptions({ queryKey: ["page", slug], queryFn: () => getPage({ data: { slug } }) });
