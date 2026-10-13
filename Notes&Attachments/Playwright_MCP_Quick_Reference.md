# Playwright MCP & AI Testing --- Quick Reference

A practical reference for setting up Playwright MCP in VS Code and using
Playwright's **planner, generator, and healer** agents.

## 1. Know the difference

  -----------------------------------------------------------------------
  Tool                    What it does            Best for
  ----------------------- ----------------------- -----------------------
  **Playwright MCP**      Lets an AI agent        Exploring a website,
                          control a real browser  checking a flow,
                          through MCP tools.      inspecting elements,
                                                  quick validation.

  **Playwright Test**     The automation          CI/CD, regression,
                          framework that runs     assertions, reports and
                          repeatable tests        repeatable execution.
                          (`.spec.ts`).           

  **Planner agent**       Explores the app and    Turning requirements
                          creates a Markdown test into scenarios.
                          plan.                   

  **Generator agent**     Converts the plan into  Creating maintainable
                          Playwright Test files.  automated tests.

  **Healer agent**        Runs failing tests,     Updating stale locators
                          investigates failures   or addressing test
                          and proposes/attempts   issues.
                          repairs within its      
                          guardrails.             
  -----------------------------------------------------------------------

**Important:** Using Playwright MCP to interact with a browser is not
the same as creating and running a permanent Playwright Test suite.

## 2. Requirements

-   VS Code with GitHub Copilot Agent mode.
-   Node.js (Playwright MCP currently documents Node.js 20+).
-   A project folder opened in VS Code.
-   Trust the workspace and review tool permissions before allowing
    browser actions.

Check Node/npm:

``` bash
node -v
npm -v
```

## 3. Configure Playwright MCP in VS Code

In the project, create or open `.vscode/mcp.json`:

``` json
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  },
  "inputs": []
}
```

Save the file, start the server using the **Start** control or Command
Palette MCP commands, and approve the workspace/server trust prompt if
shown.

> VS Code also supports the portable `.mcp.json` format with a top-level
> `mcpServers` object. Use the format expected by your chosen client;
> don't mix the two schemas in one file.

## 4. Verify MCP is working

1.  Open Copilot Chat and select **Agent** mode.
2.  Open the tools picker and confirm Playwright tools are available.
3.  Ask the agent to use the browser---not merely explain what it would
    do.

**Smoke-test prompt:**

> Use the Playwright MCP tools to open
> `https://demo.playwright.dev/todomvc/`. Add a todo named
> `Learn Playwright MCP`, verify it appears, mark it complete, and
> verify its completed state. Use actual browser tools, report each
> verification, and do not create a standalone test file.

If it only returns instructions or code, ask it to use the connected
Playwright MCP tools. If tools are missing, check the MCP server
status/output and restart it.

## 5. Set up Playwright Test Agents

From the project root, run:

``` bash
npx playwright init-agents --loop=vscode
```

This generates the agent definitions/instructions for the VS Code
workflow. Review the generated files and commit them if you want the
team to share the same setup. Regenerate them when updating Playwright
so the definitions stay current.

Typical workflow: 1. **Planner** --- explore the app and write a test
plan in Markdown. 2. **Generator** --- turn the approved plan into
`.spec.ts` tests. 3. **Run/review** --- inspect the generated code,
assertions, test data and locators; run the suite. 4. **Healer** ---
investigate failing tests and suggest/attempt fixes, then rerun and
review the diff.

The exact generated file locations can vary by Playwright version and
agent loop; check the command output and generated files rather than
assuming a fixed path.

## 6. What each agent should produce

### Planner

-   Understand the requirement and relevant user journey.
-   Identify positive, negative, boundary and validation scenarios where
    relevant.
-   State preconditions, test data and expected results.
-   Avoid inventing behaviour that isn't in the requirement or
    observable app.

**Prompt:**\
`Use the Playwright planner to create a concise test plan for [feature/flow]. Include preconditions, positive and negative scenarios, test data, and expected results. Flag unclear requirements instead of guessing.`

### Generator

-   Use the approved plan and existing project conventions.
-   Prefer resilient locators: role/label/text/test ID where
    appropriate.
-   Use assertions for outcomes, not just actions.
-   Reuse fixtures/helpers and keep tests independent.

**Prompt:**\
`Use the Playwright generator to implement the approved plan as Playwright Test specs. Follow the project's existing structure and conventions. Do not change application code. Run the tests and report failures.`

### Healer

-   Diagnose before editing: application defect, locator drift, timing,
    test data, environment or flaky test.
-   Make the smallest justified change.
-   Never weaken/remove assertions just to make a test pass.
-   Do not silently skip a failing test; explain any proposed skip and
    why.

**Prompt:**\
`Use the Playwright healer on the failing test. Identify the root cause first, make the smallest justified fix, rerun the test, and summarize the code changes. Do not weaken assertions or hide application defects.`

## 7. Useful prompts for day-to-day QA

**Explore a flow with MCP** \> Use Playwright MCP to explore
\[URL/flow\]. Verify \[expected outcome\]. Report the steps and
evidence. Do not modify project files.

**Create tests from a requirement** \> Review the requirement below,
list missing details, then use the planner and generator workflow to
create Playwright tests. Reuse project conventions and do not invent
expected behaviour.

**Review generated tests** \> Review these Playwright tests for reliable
locators, meaningful assertions, independent test data, cleanup, and
maintainability. Suggest only necessary changes.

**Investigate a failure** \> Run the relevant test, inspect the failure
and determine whether it is an application bug, test bug, data issue or
environment issue. Do not change code until you explain the likely root
cause.

## 8. Good practices and safety

-   Keep secrets, passwords, tokens and real customer data out of
    prompts, test files and source control.
-   Use approved test accounts and non-production data.
-   Review AI-generated code and diffs before accepting changes.
-   Prefer role/label/test-ID locators over brittle CSS/XPath or dynamic
    IDs.
-   Prefer condition-based waits and web-first assertions over fixed
    sleeps.
-   Keep assertions meaningful; a passing test must prove the expected
    behaviour.
-   Run the suite locally before relying on CI results.
-   Use MCP for exploration; use Playwright Test for repeatable
    regression and CI/CD.
-   An MCP browser action can change state. Be careful with submit,
    delete, payment or other destructive actions.

## 9. Troubleshooting checklist

-   **No Playwright tools:** check the MCP config syntax, start/restart
    the server, inspect MCP output, and confirm Agent mode/tool access.
-   **`npx` or package errors:** verify Node/npm and network/package
    access.
-   **Browser does not open:** check server output, browser availability
    and permissions.
-   **Agent describes actions but does not perform them:** explicitly
    require actual MCP tool calls and verify the tool picker shows
    Playwright tools.
-   **Generated tests fail:** inspect the first meaningful error,
    locator, test data, environment and assertion before changing
    anything.
-   **Agents missing/outdated:** rerun
    `npx playwright init-agents --loop=vscode` after checking the
    installed Playwright version and reviewing the generated changes.

## Official references

-   [Playwright MCP
    guide](https://playwright.dev/docs/getting-started-mcp)
-   [Playwright Test Agents](https://playwright.dev/docs/test-agents)
-   [Playwright test generator /
    codegen](https://playwright.dev/docs/codegen)
-   [VS Code MCP server
    setup](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
-   [VS Code MCP configuration
    reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
