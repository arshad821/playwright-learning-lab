# Playwright Debugging & Useful Commands

Useful commands and notes for running, debugging, and investigating Playwright tests.

## Running Tests

```bash
npx playwright test

#Run all tests normally.
npx playwright test --headed

#Run tests with the browser visible.
npx playwright test --debug

#Run in debug mode with Playwright Inspector for step-by-step debugging.
npx playwright test --ui

#Open Playwright UI Mode to run, inspect, and debug tests visually.
npx playwright test tests/filename.spec.js

#Run a specific test file.
npx playwright test -g "Test Name"

#After running tests:
npx playwright show-report

## Playwright Inspector
Playwright Inspector is a debugging window that helps you inspect and debug tests interactively.

It can be opened using:

```bash
npx playwright test --debug

#What you can do in Playwright Inspector
Pause the test at a specific point.
Execute test steps one by one.
Resume or continue execution.
Inspect the current page while the test is paused.
Use the locator picker to select elements from the page.
Generate Playwright locators for selected elements.
Test/debug locators before adding them to the test.
See the current test execution state.
Understand which step is currently being executed.