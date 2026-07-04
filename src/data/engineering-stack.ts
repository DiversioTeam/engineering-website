export interface EngineeringStackTechnology {
  name: string;
  logoSrc: string;
  logoAlt: string;
  wide?: boolean;
  href?: string;
}

export interface EngineeringStackLayer {
  slug: string;
  label: string;
  title: string;
  summary: string;
  whyItFits: string;
  technologies: EngineeringStackTechnology[];
  supportingTools?: string[];
  relatedHref?: string;
  relatedLabel?: string;
}

// Official logos/icons are stored locally under public/logos/stack/.
// Prefer stable, vendor-maintained assets over third-party icon sets.
export const engineeringStack: EngineeringStackLayer[] = [
  {
    slug: "application",
    label: "Application stack",
    title: "Django, Python, React, TypeScript, and PostgreSQL at the product layer",
    summary:
      "The core application stack favors mature backend ergonomics, typed frontend workflows, and a relational data model that holds up under product complexity.",
    whyItFits:
      "This combination gives us a practical balance of shipping speed, reviewability, and long-lived application maintainability across backend and frontend work.",
    technologies: [
      { name: "Django", logoSrc: "/logos/stack/django.svg", logoAlt: "Django logo", wide: true },
      { name: "Python", logoSrc: "/logos/stack/python.svg", logoAlt: "Python logo", wide: true },
      { name: "React", logoSrc: "/logos/stack/react.png", logoAlt: "React logo" },
      { name: "TypeScript", logoSrc: "/logos/stack/typescript.png", logoAlt: "TypeScript logo" },
      { name: "PostgreSQL", logoSrc: "/logos/stack/postgresql.png", logoAlt: "PostgreSQL logo" },
    ],
  },
  {
    slug: "design-system",
    label: "Design and UI foundation",
    title: "A shared design system and design workflow keep product surfaces aligned",
    summary:
      "Frontend work sits on top of a shared design system, with design exploration and implementation moving through the same reusable component language instead of one-off page decisions.",
    whyItFits:
      "A durable UI layer improves consistency, keeps review conversations focused on behavior instead of re-litigating presentation from scratch, and lowers the cost of iteration across multiple product surfaces.",
    technologies: [
      { name: "Diversio Design System", logoSrc: "/favicon.svg", logoAlt: "Diversio mark" },
      { name: "Figma", logoSrc: "/logos/stack/figma.svg", logoAlt: "Figma logo" },
      { name: "React", logoSrc: "/logos/stack/react.png", logoAlt: "React logo" },
      { name: "TypeScript", logoSrc: "/logos/stack/typescript.png", logoAlt: "TypeScript logo" },
    ],
  },
  {
    slug: "platform",
    label: "Platform and infrastructure",
    title: "AWS, Terraform, and Terragrunt keep infrastructure repeatable",
    summary:
      "Infrastructure is treated as part of the engineering system, with managed cloud primitives, infrastructure as code, and orchestration that stays legible across many stacks and environments.",
    whyItFits:
      "We want repeatability, safer change management, and infrastructure work that can be reasoned about with the same care as product code.",
    technologies: [
      { name: "AWS", logoSrc: "/logos/stack/aws.png", logoAlt: "AWS logo", wide: true },
      { name: "Terraform", logoSrc: "/logos/stack/terraform.svg", logoAlt: "Terraform icon" },
      { name: "Terragrunt", logoSrc: "/logos/stack/terragrunt.png", logoAlt: "Terragrunt icon" },
    ],
  },
  {
    slug: "delivery",
    label: "Delivery and automation",
    title: "GitHub Actions and CircleCI automate the delivery paths that need to stay boring",
    summary:
      "CI and release automation sit inside the operating model. Different repositories lean on different automation surfaces depending on how they deploy and what they need to validate.",
    whyItFits:
      "Keeping build, packaging, and deployment paths explicit makes change safer, easier to audit, and easier to recover when something drifts.",
    technologies: [
      { name: "GitHub Actions", logoSrc: "/logos/stack/github.svg", logoAlt: "GitHub icon" },
      { name: "CircleCI", logoSrc: "/logos/stack/circleci.svg", logoAlt: "CircleCI logo" },
    ],
    supportingTools: ["GitHub"],
  },
  {
    slug: "analytics",
    label: "Data and analytics",
    title: "Product analytics and event contracts matter because instrumentation is part of the product",
    summary:
      "Analytics work is treated as an engineering surface. Events, data flow, and implementation patterns need to stay clear enough that teams can trust what gets measured.",
    whyItFits:
      "Instrumentation is only useful when it stays close to the product behavior it describes and when engineers can evolve it without turning the data model into folklore.",
    technologies: [
      { name: "Mixpanel", logoSrc: "/logos/stack/mixpanel.svg", logoAlt: "Mixpanel logo", wide: true },
      { name: "PostgreSQL", logoSrc: "/logos/stack/postgresql.png", logoAlt: "PostgreSQL logo" },
    ],
  },
  {
    slug: "developer-environment",
    label: "Developer environment",
    title: "cmux, Zed, Pi, Docker, and flexible local tooling keep daily work moving",
    summary:
      "Daily engineering work depends on more than the application stack. Editors, terminals, local containers, remote sandboxes, and quick connectivity tools all affect how quickly an engineer can understand a problem and move through it.",
    whyItFits:
      "We embrace open tools that reduce friction in the daily loop: editor choices that stay fast, terminal workflows that make session handoff easier, sandboxes that isolate risky work, and connectivity tools that help expose or test systems without heavyweight setup. cmux has become the primary daily driver in that environment, with Ghostty still very much in the mix.",
    technologies: [
      { name: "cmux", logoSrc: "/logos/stack/cmux.png", logoAlt: "cmux logo", wide: true },
      { name: "Zed", logoSrc: "/logos/stack/zed.png", logoAlt: "Zed logo" },
      { name: "Pi", logoSrc: "/logos/stack/pi.svg", logoAlt: "Pi logo", wide: true },
      { name: "Docker", logoSrc: "/logos/stack/docker.png", logoAlt: "Docker logo" },
      { name: "sandboxes.cloud", logoSrc: "/logos/stack/sandboxes.svg", logoAlt: "sandboxes.cloud logo" },
      { name: "ngrok", logoSrc: "/logos/stack/ngrok.png", logoAlt: "ngrok logo" },
    ],
    supportingTools: ["Ghostty", "tmux", "nvm"],
  },
  {
    slug: "workflow",
    label: "Workflow and publishing tooling",
    title: "Bruno, Astro, uv, Ruff, agentic tooling, and coding models support the way we ship",
    summary:
      "We invest in tools that improve context recovery, review quality, API visibility, and the speed at which repeated engineering work becomes reusable instead of staying trapped in local setup. That daily workflow now includes regular use of OpenAI Codex and Anthropic models for drafting, review, debugging, and explanation.",
    whyItFits:
      "These tools earn their place when they shorten feedback loops and keep the work inspectable. Docs, request definitions, local workflow tools, agentic helpers, and strong coding models all help when they stay close to the code and reasoning they support.",
    technologies: [
      { name: "Bruno", logoSrc: "/logos/stack/bruno.png", logoAlt: "Bruno logo", wide: true },
      { name: "Astro", logoSrc: "/logos/stack/astro.svg", logoAlt: "Astro logo" },
      { name: "uv", logoSrc: "/logos/stack/uv.svg", logoAlt: "Astral logo for uv", wide: true },
      { name: "Ruff", logoSrc: "/logos/stack/ruff.svg", logoAlt: "Astral logo for Ruff", wide: true },
      { name: "Agentic Tools", logoSrc: "/favicon.svg", logoAlt: "Diversio mark" },
      {
        name: "Codex",
        logoSrc: "/logos/stack/codex.png",
        logoAlt: "Codex logo",
        href: "https://developers.openai.com/codex/overview",
      },
      {
        name: "Anthropic",
        logoSrc: "/logos/stack/anthropic.png",
        logoAlt: "Anthropic logo",
        href: "https://platform.claude.com/docs/en/about-claude/models/overview",
      },
    ],
    supportingTools: [
      "Codex 5.4",
      "Codex 5.5",
      "Anthropic Fable",
      "Anthropic Opus",
      "Anthropic Sonnet",
    ],
    relatedHref: "/blog/from-postman-to-bruno-how-ai-changed-our-api-workflow",
    relatedLabel: "Related writing",
  },
  {
    slug: "exploration",
    label: "Exploration and analysis",
    title: "Google Colab, Jupyter notebooks, and IPython help us work through messy problems quickly",
    summary:
      "Not every useful engineering task starts as product code. We also lean on notebooks and interactive Python workflows for one-off analysis, data shaping, exploratory debugging, and validating ideas before they harden into more permanent tooling.",
    whyItFits:
      "These tools reduce friction when the job is to inspect, experiment, or explain a problem clearly. We treat them as practical companions to the main stack, not as second-class workflows.",
    technologies: [
      { name: "Google Colab", logoSrc: "/logos/stack/colab.png", logoAlt: "Google Colab logo" },
      { name: "Jupyter", logoSrc: "/logos/stack/jupyter.svg", logoAlt: "Jupyter logo" },
      { name: "IPython", logoSrc: "/logos/stack/ipython.png", logoAlt: "IPython logo", wide: true },
      { name: "Python", logoSrc: "/logos/stack/python.svg", logoAlt: "Python logo", wide: true },
    ],
  },
];
