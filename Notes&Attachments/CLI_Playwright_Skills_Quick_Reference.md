# CLI, Playwright CLI & AI Agent Skills --- Quick Reference

A concise, reusable guide for QA engineers using the terminal,
Playwright Test, MCP, and AI-assisted testing in VS Code.

## 1. CLI basics

A **CLI (Command-Line Interface)** lets you run tools by typing commands
in a terminal. In VS Code, open **Terminal → New Terminal**.

  -----------------------------------------------------------------------
  Command                             Purpose
  ----------------------------------- -----------------------------------
  `pwd`                               Show the current directory
                                      (macOS/Linux/Git Bash).

  `ls` / `dir`                        List files (`ls` on macOS/Linux;
                                      `dir` also works in Windows
                                      terminals).

  `cd folder-name`                    Move into a folder.

  `cd ..`                             Move up one directory.

  `mkdir folder-name`                 Create a folder.

  `clear` / `cls`                     Clear the terminal (`clear`
                                      macOS/Linux; `cls` Windows CMD).

  `git status`                        Show changed files and current
                                      branch.

  `git pull`                          Fetch and integrate remote changes.

  `git stash` / `git stash pop`       Temporarily save changes / restore
                                      the latest stash.
  -----------------------------------------------------------------------

**Tip:** Run commands from the project root---the folder containing
`package.json` and usually `playwright.config.ts`.

## 2. Check setup and initialise Playwright

``` bash
node -v
npm -v
```

For a new Playwright Test project:

``` bash
npm init playwright@latest
```

Follow the prompts to choose language, test folder and whether to add a
CI workflow.

For an existing project:

``` bash
npm install
```

## 3. Essential Playwright CLI commands

Run from the project root.

  ----------------------------------------------------------------------------------
  Command                                        Purpose
  ---------------------------------------------- -----------------------------------
  `npx playwright test`                          Run all tests.

  `npx playwright test tests/login.spec.ts`      Run one test file.

  `npx playwright test --project=chromium`       Run a configured browser project.

  `npx playwright test --headed`                 Show the browser while tests run.

  `npx playwright test --ui`                     Open Playwright UI mode.

  `npx playwright test --debug`                  Debug with the Playwright
                                                 Inspector.

  `npx playwright test --grep "login"`           Run tests whose title matches the
                                                 pattern.

  `npx playwright test --list`                   List tests without running them.

  `npx playwright test --workers=1`              Use one worker while debugging.

  `npx playwright show-report`                   Open the last generated HTML
                                                 report.

  `npx playwright codegen https://example.com`   Record browser interactions to help
                                                 create locators/code.

  `npx playwright install`                       Install Playwright browser
                                                 binaries.
  ----------------------------------------------------------------------------------

`--project=chromium` works only if that project is configured in
`playwright.config.ts`.

## 4. Practical daily workflow

``` bash
npm install
npx playwright install
npx playwright test tests/login.spec.ts
npx playwright test tests/login.spec.ts --headed
npx playwright show-report
```

Use `--debug` or `--ui` to investigate failures.

### Useful reporting/debugging options

``` bash
npx playwright test --trace on-first-retry --retries=1
npx playwright test --reporter=list
npx playwright test --reporter=html
```

Use traces, screenshots, logs and error messages to determine whether a
failure is caused by the application, test, data or environment. Don't
use retries to hide flaky tests.

## 5. npm scripts

Add convenient scripts to the existing `package.json`:

``` json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

If a `scripts` section already exists, add these entries rather than
replacing the entire section.

Run them with:

``` bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:report
```

## 6. Important project files

  -----------------------------------------------------------------------
  File/folder                         Purpose
  ----------------------------------- -----------------------------------
  `playwright.config.ts`              Browser projects, base URL,
                                      retries, reporter, timeouts and
                                      other settings.

  `tests/`                            Test specifications, commonly
                                      `*.spec.ts`.

  `package.json`                      Dependencies and npm scripts.

  `package-lock.json`                 Locks dependency versions for
                                      repeatable installs.

  `playwright-report/`                Common default HTML report
                                      location.

  `test-results/`                     Common output for results and
                                      failure artifacts.
  -----------------------------------------------------------------------

Output folders can be changed in the Playwright configuration.

## 7. AI instructions, Skills and Chat modes

These are related but different concepts. Exact features and discovery
rules depend on the AI client and version.

### Custom instructions

Custom instructions define general project rules the AI should follow.

For GitHub Copilot, a common repository-level file is:

``` text
.github/copilot-instructions.md
```

Example:

``` markdown
# Project QA Instructions

- Use Playwright Test with TypeScript.
- Follow the existing project structure and conventions.
- Reuse fixtures and helper methods where appropriate.
- Prefer resilient role, label, and test-ID locators.
- Include meaningful assertions.
- Avoid unnecessary fixed waits.
- Do not modify application code when asked only to create tests.
- Explain the likely root cause before fixing failures.
- Never weaken assertions just to make tests pass.
```

### Skills files

A **skill** provides focused instructions for a specialised task, such
as creating Playwright tests or diagnosing flaky tests. It may include
workflows, examples and supporting scripts.

Example structure for a client that supports this convention:

``` text
.github/
└── skills/
    └── playwright-testing/
        └── SKILL.md
```

Example `SKILL.md`:

``` markdown
---
name: playwright-testing
description: Create and maintain reliable Playwright tests using project conventions.
---

# Playwright Testing Skill

1. Inspect existing tests and configuration first.
2. Use TypeScript and Playwright Test.
3. Prefer getByRole(), getByLabel(), and getByTestId().
4. Assert the expected outcome, not just that actions ran.
5. Reuse fixtures and helpers where suitable.
6. Keep tests independent and test data controlled.
7. Diagnose failures before editing.
8. Do not hide application defects or weaken assertions.
```

**Important:** Skill folder names and metadata requirements vary by AI
client. Use the directory and format documented by your tool. A
`SKILL.md` file will not necessarily load automatically just because it
exists.

### Skills vs instructions

  -----------------------------------------------------------------------
  Skills                              Custom instructions
  ----------------------------------- -----------------------------------
  Focused guidance for a particular   General rules for the
  task.                               repository/project.

  Can describe specialised workflows  Define coding style, boundaries and
  and examples.                       expectations.

  Useful for reusable QA procedures.  Useful for consistent behaviour
                                      across tasks.
  -----------------------------------------------------------------------

**Rule of thumb:** Instructions define the general rules; skills provide
specialised task guidance.

### Chat modes

Depending on your VS Code version and AI extension, you may see modes
such as:

-   **Ask:** Explain code, answer questions, or analyse a failure
    without editing files.
-   **Edit:** Make requested code changes through an editing workflow.
-   **Agent:** Execute multi-step tasks using available tools,
    potentially including MCP.

Use a mode that supports the tools you need. Mode names and availability
can vary.

## 8. Playwright MCP and Test Agents

-   **Playwright MCP:** Lets a compatible AI agent interact with a
    browser through MCP tools. Useful for exploration and browser-based
    investigation.
-   **Playwright Test:** Runs repeatable automated tests locally and in
    CI/CD.
-   **Planner agent:** Explores requirements/application behaviour and
    creates a test plan.
-   **Generator agent:** Converts the plan into Playwright Test specs.
-   **Healer agent:** Investigates failing tests and proposes/attempts
    repairs; review all changes.

To initialise Playwright Test Agents for the VS Code workflow, run from
the project root:

``` bash
npx playwright init-agents --loop=vscode
```

Review the generated files and the command output; paths and agent
capabilities can vary by Playwright version and client.

### Suggested workflow

``` text
Requirement
   ↓
Project instructions + relevant skill
   ↓
Planner → Markdown test plan
   ↓
Generator → *.spec.ts files
   ↓
Run tests with Playwright CLI
   ↓
Review failures → Healer if appropriate
   ↓
Review code/diff and rerun
   ↓
CI/CD
```

MCP can support browser exploration at different stages. It does not
replace repeatable Playwright Test specs.

## 9. Useful AI prompts

**Explore with MCP** \> Use the connected Playwright MCP tools to
explore \[URL/flow\]. Verify \[expected outcome\], report what you
observed, and do not modify project files.

**Plan tests** \> Create a concise test plan for \[feature\]. Include
positive, negative, boundary and validation cases where relevant. Flag
unclear requirements rather than inventing expected behaviour.

**Generate tests** \> Implement the approved plan as Playwright Test
specs. Follow project instructions and existing conventions. Do not
modify application code. Run the relevant tests and report failures.

**Heal a failure** \> Diagnose the failing test before editing. Identify
whether the cause is application behaviour, locator drift, timing, data
or environment. Make the smallest justified test fix, rerun it, and do
not weaken assertions or hide application defects.

## 10. CI/CD essentials

A typical pipeline:

1.  Check out the repository.
2.  Install the supported Node.js version.
3.  Run `npm ci` to install dependencies from the lockfile.
4.  Install required Playwright browsers and any supported OS
    dependencies.
5.  Run `npx playwright test`.
6.  Publish reports and failure artifacts.

Keep credentials in the CI secret store, not in source code. Use
approved test accounts and non-production data.

## 11. Troubleshooting checklist

-   **Playwright command not found:** run `npx playwright ...` from the
    project root and install dependencies.
-   **Browser executable missing:** run `npx playwright install`.
-   **MCP tools unavailable:** check MCP config, server status, tool
    permissions and supported chat mode.
-   **Skill not being used:** confirm the AI client supports skills and
    the file is in its documented location.
-   **Test fails only in CI:** compare Node/browser versions,
    environment variables, test data, permissions and timing.
-   **Timeout:** inspect the locator and error; prefer condition-based
    waits and web-first assertions.
-   **Report missing:** ensure a test run generated it and check the
    configured reporter/output path.

## 12. Good practices

-   Work from the project root and review `git status` before
    committing.
-   Review AI-generated code and diffs before accepting changes.
-   Prefer resilient locators and meaningful assertions.
-   Keep tests independent and avoid shared mutable test data.
-   Never store secrets or real customer data in prompts or committed
    files.
-   Use MCP for exploration and Playwright Test for repeatable
    regression.
-   Run tests locally before relying on CI results.

## Official references

-   [Playwright CLI](https://playwright.dev/docs/test-cli)
-   [Playwright getting started](https://playwright.dev/docs/intro)
-   [Playwright
    configuration](https://playwright.dev/docs/test-configuration)
-   [Playwright Test Agents](https://playwright.dev/docs/test-agents)
-   [Playwright MCP
    guide](https://playwright.dev/docs/getting-started-mcp)
-   [VS Code MCP
    servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
-   [VS Code custom
    instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
-   [GitHub Copilot custom
    instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
-   [GitHub Copilot Agent
    Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
