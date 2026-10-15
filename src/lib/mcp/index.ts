import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listContent from "./tools/list-content";
import createContent from "./tools/create-content";
import setContentStatus from "./tools/set-content-status";
import listMessages from "./tools/list-messages";
import getContent from "./tools/get-content";
import updateContent from "./tools/update-content";
import deleteContent from "./tools/delete-content";
import restoreContent from "./tools/restore-content";
import checkSiteHealth from "./tools/check-site-health";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "khidr",
  title: "Khidr",
  version: "0.2.0",
  instructions: "Manage Khider Mamoun's site (admin account required for every tool): list, read, create, edit, publish, trash and restore content; run a read-only site health check; read contact messages. Every write is recorded in an audit log.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listContent, getContent, createContent, updateContent, setContentStatus, deleteContent, restoreContent, checkSiteHealth, listMessages],
});
