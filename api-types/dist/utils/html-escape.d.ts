/**
 * Escapes a string for safe interpolation into raw HTML (server-rendered
 * templates, not JSX - React/JSX already escapes on its own). Used wherever
 * DB-sourced text (approval summaries, department/workflow names) is
 * interpolated into a public-facing page or email body.
 */
export declare function escapeHtml(value: string): string;
//# sourceMappingURL=html-escape.d.ts.map