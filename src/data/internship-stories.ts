export interface InternshipStoryTool {
  name: string;
  logoSrc: string;
  logoAlt: string;
  wide?: boolean;
}

export interface InternshipStory {
  eyebrow: string;
  title: string;
  toolsLabel: string;
  tools: InternshipStoryTool[];
  summary: string;
  detail: string;
  outcomes: string[];
}

export const internshipProgramSnapshot = {
  internCount: 5,
  shippedChangesLabel: "275+ production changes",
  periodLabel: "Recent cohorts across 2022-2026",
  methodology:
    "These stories are drawn from real intern work that shipped into production systems, internal tooling, and core operational workflows.",
} as const;

export const internshipStories: InternshipStory[] = [
  {
    eyebrow: "Workflow infrastructure",
    title: "One intern worked on the part of engineering most teams never formalize well",
    toolsLabel: "GitHub webhooks, GraphQL, Slack notifications, CI policy, and internal automation",
    tools: [
      { name: "GitHub", logoSrc: "/logos/stack/github.svg", logoAlt: "GitHub logo" },
      { name: "CircleCI", logoSrc: "/logos/stack/circleci.svg", logoAlt: "CircleCI logo" },
      { name: "Python", logoSrc: "/logos/stack/python.svg", logoAlt: "Python logo", wide: true },
      { name: "AWS", logoSrc: "/logos/stack/aws.png", logoAlt: "AWS logo", wide: true },
    ],
    summary:
      "This internship landed in an area a lot of companies leave half-manual forever: the messy space between pull requests, reviews, CI, releases, and team communication.",
    detail:
      "The result was work on Naboo, a GitHub-native workflow service that turned recurring coordination problems into software. That included the logic around webhook handling, CI visibility, merge-risk signaling, release messaging, and the guardrails needed to keep those actions trustworthy. This is the kind of project that shows real engineering judgment because the value is not in one feature. It is in making the whole workflow calmer, clearer, and harder to get wrong. The strongest proof point is that the team still uses it.",
    outcomes: [
      "Less manual coordination around PR state, review state, release flow, and CI visibility.",
      "A durable internal tool that stayed useful after the internship ended.",
      "A strong example of intern work becoming engineering infrastructure rather than a one-off project.",
    ],
  },
  {
    eyebrow: "Data and platform systems",
    title: "Another intern was trusted with a part of the product where mistakes are expensive",
    toolsLabel: "Django admin workflows, AI-assisted mapping, parsing pipelines, enrichment flows, rollback paths, and analytics logic",
    tools: [
      { name: "Django", logoSrc: "/logos/stack/django.svg", logoAlt: "Django logo", wide: true },
      { name: "Python", logoSrc: "/logos/stack/python.svg", logoAlt: "Python logo", wide: true },
      { name: "PostgreSQL", logoSrc: "/logos/stack/postgresql.png", logoAlt: "PostgreSQL logo" },
      { name: "React", logoSrc: "/logos/stack/react.png", logoAlt: "React logo" },
      { name: "TypeScript", logoSrc: "/logos/stack/typescript.png", logoAlt: "TypeScript logo" },
    ],
    summary:
      "The work sat in a high-consequence part of the system: survey ingestion, enrichment, parsing, validation, and the operational tooling around all of it.",
    detail:
      "That included automatic survey processing, supplementary CSV enrichment, parser upgrades, metadata propagation, and rollback-aware admin workflows. It also reached into customer-facing analytics, where backend logic, frontend display, and shared UI all had to agree. This is strong internship work because it did more than add capability. It made a fragile operational surface more structured, more reversible, and easier for the team to trust with production data.",
    outcomes: [
      "Manual, error-prone survey handling moved toward structured workflows with approval, processing, and rollback paths.",
      "Analytics behavior improved across backend logic, frontend presentation, and reusable UI components.",
      "A core operational part of the product became more reliable, not just more feature-rich.",
    ],
  },
  {
    eyebrow: "Platform and product ownership",
    title: "Several interns followed the same arc: learn fast, then take on deeper system ownership",
    toolsLabel: "Role-mapping changes, async processing, notification systems, profile APIs, parsing reliability, and internal admin tooling",
    tools: [
      { name: "Django", logoSrc: "/logos/stack/django.svg", logoAlt: "Django logo", wide: true },
      { name: "Python", logoSrc: "/logos/stack/python.svg", logoAlt: "Python logo", wide: true },
      { name: "PostgreSQL", logoSrc: "/logos/stack/postgresql.png", logoAlt: "PostgreSQL logo" },
      { name: "GitHub", logoSrc: "/logos/stack/github.svg", logoAlt: "GitHub logo" },
      { name: "CircleCI", logoSrc: "/logos/stack/circleci.svg", logoAlt: "CircleCI logo" },
    ],
    summary:
      "Some internships started with scripts, fixes, or implementation-heavy work and then expanded into model changes, async systems, notifications, APIs, and operator-facing tooling.",
    detail:
      "That progression is one of the strongest signals on this page. Interns were not frozen in support work. They moved into deeper backend and platform responsibilities once they had the context to handle them well. The result was better admin tooling, safer parsing behavior, stronger profile and notification systems, and improvements to parts of the platform that other engineers and operators rely on every day.",
    outcomes: [
      "Interns were trusted with model changes, async systems, notifications, and internal platform capabilities.",
      "Operational tooling improved for the people running onboarding, parsing, and survey workflows day to day.",
      "The internship can evolve from concrete support tasks into broader systems ownership.",
    ],
  },
];
