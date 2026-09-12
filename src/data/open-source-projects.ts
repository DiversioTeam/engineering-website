// Additional open-source projects to highlight outside the main Agentic Tools
// registry.
//
// Why a separate data file instead of hardcoding the cards in a page?
// - the homepage and community page both need the same list
// - project order is intentional and should be easy to review
// - adding/removing a repo should be a small data edit, not a page rewrite
export const openSourceProjects = [
  {
    name: "local-ci",
    repo: "DiversioTeam/local-ci-runner",
    category: "Developer workflow",
    description: "Run your repository’s checks locally, inspect saved results, and report results to GitHub when ready.",
    url: "https://github.com/DiversioTeam/local-ci-runner",
  },
  {
    name: "pi-cmux",
    repo: "DiversioTeam/pi-cmux",
    category: "Shared runtime",
    description: "Organize Pi coding agents in the cmux terminal with split panes, workspace tabs, and native notifications.",
    url: "https://github.com/DiversioTeam/pi-cmux",
  },
  {
    name: "clickup-mcp",
    repo: "DiversioTeam/clickup-mcp",
    category: "MCP",
    description: "Connect ClickUp tasks and workspace context to MCP-enabled tools.",
    url: "https://github.com/DiversioTeam/clickup-mcp",
  },
  {
    name: "gemini-cli-mcp",
    repo: "DiversioTeam/gemini-cli-mcp",
    category: "MCP",
    description: "Expose Gemini CLI workflows through MCP for research and automation.",
    url: "https://github.com/DiversioTeam/gemini-cli-mcp",
  },
];
