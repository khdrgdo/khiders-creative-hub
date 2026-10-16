<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- MCP server lives in src/lib/mcp (OAuth, tools act as signed-in user under RLS); never use anon-key write scripts. Why: old external worker bypassed auth and failed under RLS.

- Site colors are resolved and applied centrally through site-theme and SiteTheme; administrator color edits use the existing RLS-protected site_settings row and announce success only after persistence. Why: all public pages must share saved colors across browsers while the administrator keeps its independent theme.
- Reference-inspired homepage composition uses reusable public sections and existing content, without invented testimonials or proficiency percentages. Why: preserve authentic personal content while changing presentation.
