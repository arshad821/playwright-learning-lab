# Playwright Learning Lab

A hands-on QA automation repository for learning and practising
**Playwright**, including browser interactions, locators, assertions,
API testing, network interception, fixtures, Page Object Model (POM),
data-driven tests, screenshots/visual comparison, and Cucumber-style
BDD.

> This README describes the structure visible in this repository. Check
> `package.json` and `playwright.config.js` for the exact scripts,
> versions, configuration, and commands supported by your local setup.

## What this repository covers

-   Browser contexts, tabs/windows, locators, assertions, dropdowns and
    radio buttons.
-   Dialogs, alerts, frames, timeouts and screenshot/visual comparison.
-   API testing, login/API storage state, and network interception.
-   Order creation and request interception examples.
-   Fixtures, dynamic test data and Page Object Model.
-   Excel upload/download testing and UI performance examples.
-   Cucumber/BDD feature files, step definitions and hooks.
-   AI-assisted testing resources, including Playwright MCP
    configuration and a Playwright CLI skill.

## Repository structure

``` text
PLAYWRIGHT-LEARNING-LAB/
├── .claude/
│   └── skills/
│       └── playwright-cli/
│           ├── references/
│           └── SKILL.md
├── .github/
│   ├── agents/
│   └── workflows/
│       ├── copilot-setup-steps.yml
│       └── playwright.yml
├── .playwright/
├── .playwright-mcp/
│   ├── console-*.log
│   └── page-*.yml
├── .vscode/
│   └── mcp.json
├── features/
│   ├── Steps/
│   │   └── 24.EcommerceSteps.js
│   ├── support/
│   │   └── hooks.js
│   └── Ecommerce.feature
├── PageObjects/
├── PageObjects_TS/
├── specs/
├── tests/
├── Notes&Attachments/
├── playwright.config.js
├── playwright.service.config.js
├── package.json
├── package-lock.json
├── README.md
└── state.json
```

The tree above is representative, not exhaustive. The repository also
contains generated reports/results, screenshots, and learning examples.

## Main folders and files

  -----------------------------------------------------------------------
  Path                                Purpose
  ----------------------------------- -----------------------------------
  `tests/`                            Main collection of numbered
                                      Playwright practice tests and
                                      utilities.

  `tests/utils/`                      Shared test utilities.

  `PageObjects/`                      Page Object Model examples.

  `PageObjects_TS/`                   TypeScript-oriented Page Object
                                      Model examples.

  `specs/`                            Additional specs or test examples.

  `features/`                         Cucumber/BDD feature, step
                                      definitions and support hooks.

  `Notes&Attachments/`                Supporting learning notes and
                                      attachments.

  `.claude/skills/playwright-cli/`    Skill instructions and references
                                      for Playwright CLI tasks in
                                      compatible Claude tooling.

  `.github/agents/`                   Repository agent/custom-agent
                                      resources, if configured.

  `.github/workflows/`                GitHub Actions workflow files for
                                      setup and Playwright runs.

  `.vscode/mcp.json`                  VS Code MCP server configuration.

  `.playwright-mcp/`                  Browser MCP logs/page snapshots;
                                      typically generated troubleshooting
                                      artifacts.

  `playwright.config.js`              Main Playwright Test configuration.

  `playwright.service.config.js`      Additional service-specific
                                      Playwright configuration.

  `package.json`                      Dependencies and available npm
                                      scripts.

  `state.json`                        May contain browser authentication
                                      state; treat as sensitive and never
                                      commit real credentials/session
                                      tokens.
  -----------------------------------------------------------------------

## Test examples

The `tests/` directory includes examples covering:

-   Browser context and assertions.
-   Dropdowns, radio buttons, window handling, alerts, frames and
    locators/timeouts.
-   Login through UI and API, API storage state and network
    interception.
-   Request interception, aborting backend calls, and order-related
    flows.
-   Banner visibility and access validation.
-   Fixtures and Page Object Model.
-   Screenshot/visual comparison.
-   Excel upload/download.
-   UI performance examples.
-   Dynamic test data sets.
-   Login practice examples and seed/setup tests.
-   Generated tests, including files with names such as
    `00ClaudeGeneratedTest.spec.ts` and
    `00ClaudeGeneratedTests.spec.ts`.

These filenames indicate learning examples; inspect the individual files
to understand their exact assertions, data and execution requirements.

## Cucumber / BDD

The `features/` directory contains an e-commerce feature file, step
definitions and hooks:

-   `features/Ecommerce.feature` --- business-readable scenarios.
-   `features/Steps/24.EcommerceSteps.js` --- step implementations.
-   `features/support/hooks.js` --- scenario/test lifecycle hooks.

The precise command to run BDD scenarios depends on the Cucumber
packages and scripts configured in `package.json`.

## Getting started

### 1. Prerequisites

-   Node.js and npm.
-   Git.
-   VS Code or another editor.
-   A browser supported by the installed Playwright version.

Check your installation:

``` bash
node -v
npm -v
```

### 2. Install dependencies

From the repository root:

``` bash
npm ci
```

Use `npm install` instead if you intentionally need to update or resolve
the lockfile.

### 3. Install Playwright browsers

``` bash
npx playwright install
```

On a supported Linux CI environment, you may need browser system
dependencies as well. Follow the official Playwright CI documentation
for the runner you use.

### 4. Inspect available scripts

``` bash
npm run
```

This lists scripts defined in `package.json`. Use the repository's
actual script names rather than assuming a generic test command.

### 5. Run tests

Run the script defined by the project, or use Playwright Test directly
if the project is configured for it:

``` bash
npx playwright test
```

Run one test file:

``` bash
npx playwright test tests/2-LocatorsAndAssertions.spec.js
```

Run with a visible browser:

``` bash
npx playwright test --headed
```

Open UI mode:

``` bash
npx playwright test --ui
```

Open the HTML report after a run, if the HTML reporter is configured:

``` bash
npx playwright show-report
```

Some repository examples may require specific environment variables,
test accounts, API services, sample files, or a particular
configuration. Review the test and configuration before running them.

## Playwright MCP in VS Code

The repository contains `.vscode/mcp.json`, which is the visible
location for the VS Code MCP configuration.

1.  Open the repository in VS Code.
2.  Check the MCP configuration and confirm the Playwright server
    command/settings.
3.  Start or restart the MCP server using the controls provided by VS
    Code.
4.  Open a compatible AI chat/Agent mode and confirm Playwright tools
    are available.
5.  Test a harmless flow on a demo or approved test environment before
    using MCP on a real application.

MCP lets a compatible AI agent interact with a browser. It does **not**
replace Playwright Test specs for repeatable regression runs in CI/CD.

## Playwright CLI skill

The repository contains:

``` text
.claude/skills/playwright-cli/SKILL.md
.claude/skills/playwright-cli/references/
```

This is a skill location used by compatible Claude tooling. The skill's
exact behaviour depends on its instructions and supported client. Read
`SKILL.md` and its reference files before relying on it; other AI tools
may require a different skill location or format.

## Reports and generated artifacts

The repository includes folders such as:

-   `playwright-report/`
-   `allure-report/`
-   `allure-results/`
-   `test-results/`
-   `.playwright-mcp/`

These commonly contain generated reports, test outputs, screenshots,
logs or browser snapshots. Their exact content depends on the
configuration and previous runs.

Generated artifacts should normally be reviewed before committing. Avoid
committing large, stale or machine-specific output unless the team
intentionally tracks it.

## Security and repository hygiene

-   **Do not commit real authentication state.** Review `state.json` and
    other storage-state files; they may contain session cookies or
    tokens.
-   Never commit passwords, API keys, access tokens, or real customer
    data.
-   Use dedicated test accounts and non-production environments.
-   Keep generated reports, logs, screenshots and test results out of
    Git unless intentionally required.
-   Review `.gitignore` and run `git status` before committing.
-   Review AI-generated tests and changes before pushing.
-   Be cautious with MCP browser actions that submit forms, delete data,
    make purchases or trigger other state-changing operations.

## Suggested learning path

1.  Start with locators, assertions and basic browser interactions.
2.  Practise dropdowns, dialogs, frames, windows and waits.
3.  Learn API testing, storage state and network interception.
4.  Explore fixtures, data-driven testing and Page Object Model.
5.  Practise screenshots/visual comparison and file upload/download.
6.  Explore Cucumber/BDD.
7.  Learn Playwright CLI, reports and CI workflows.
8.  Try MCP and AI skills after the underlying tests are understandable.

## Official documentation

-   [Playwright documentation](https://playwright.dev/docs/intro)
-   [Playwright Test CLI](https://playwright.dev/docs/test-cli)
-   [Playwright
    configuration](https://playwright.dev/docs/test-configuration)
-   [Playwright debugging](https://playwright.dev/docs/debug)
-   [Playwright CI](https://playwright.dev/docs/ci)
-   [Playwright MCP](https://playwright.dev/docs/getting-started-mcp)
-   [VS Code MCP
    servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers)

## Contributing

For changes to this learning lab:

1.  Create a branch.
2.  Add or update a focused example.
3.  Run the relevant test(s).
4.  Review test output and generated artifacts.
5.  Update this README when folder structure or setup steps change.
6.  Commit only the intended files.

------------------------------------------------------------------------

**Note:** This repository is a learning lab. Confirm environment
variables, target URLs, test data, npm scripts and configuration before
running tests or using browser automation against any non-demo
application.
