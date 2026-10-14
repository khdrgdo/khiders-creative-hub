import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listContent from "./tools/list-content";
import createContent from "./tools/create-content";
import setContentStatus from "./tools/set-content-status";
import listMessages from "./tools/list-messages";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "khidr",
  title: "Khidr",
  version: "0.1.0",
  instructions: "Manage Khider Mamoun's site: list content, add books/projects/articles/research/photos, publish or unpublish them, and read contact messages. Writes require the site admin account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listContent, createContent, setContentStatus, listMessages],
});
