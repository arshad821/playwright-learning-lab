GitHub Actions + Playwright --- Future Reference Notes

Purpose: Understand what GitHub Actions does, why we use it with
Playwright, how this workflow runs, and how to troubleshoot or modify
it later.

1. What Is GitHub Actions?

GitHub Actions is an automation service built into GitHub. It can
automatically run commands whenever a chosen event happens in a
repository.

For a Playwright project, it can automatically:

Install the project dependencies.

Install the browsers required by Playwright.

Run automated tests.

Mark the workflow as passed or failed.

Save test reports as downloadable artifacts.

This is an example of CI --- Continuous Integration. Whenever code
is pushed or a pull request is opened, the tests can run automatically
instead of relying only on someone to remember to run them locally.

Without GitHub Actions

Developer changes code
        ↓
Developer remembers to run tests
        ↓
Developer checks the result
        ↓
Code is pushed to GitHub

A developer might forget to run the tests, or the tests might pass
locally but fail in another environment.

With GitHub Actions

Developer pushes code / opens a pull request
        ↓
GitHub Actions starts a workflow
        ↓
A temporary GitHub-hosted machine is prepared
        ↓
Dependencies and Playwright browsers are installed
        ↓
Playwright tests run
        ↓
GitHub shows success or failure
        ↓
Test report is saved as an artifact

Simple mental model: GitHub Actions is the automated runner;
Playwright is the testing tool that the runner executes.

2. Why Do We Need It for Playwright?

Running tests locally is useful while developing, but it does not
automatically test every change pushed to the repository.

GitHub Actions helps us:

Catch regressions early --- tests can run whenever code is
pushed or a pull request is created.

Standardize test execution --- the workflow follows the same
defined steps each time.

Check changes before merging --- a failing test run can alert
the team that a change needs attention.

Run tests without using our own computer --- GitHub-hosted
runners provide the execution machine.

Keep test reports --- reports can be downloaded from the
workflow run.

Reduce manual work --- nobody needs to open a terminal and start
the routine test command each time.

GitHub Actions does not replace Playwright. It runs Playwright
automatically.

3. Where Does the Workflow File Go?

Create this folder and file in the root of the repository:

playwright-learning-lab/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── tests/
├── package.json
├── package-lock.json
├── playwright.config.js
└── ...

The exact workflow filename can be different, for example
playwright-tests.yml. The important part is that it is inside
.github/workflows/.

Once this file is committed and pushed to GitHub, GitHub can discover
and run the workflow when its configured triggers occur.

4. The Workflow We Are Studying

name: Playwright Tests

on:
  push:
    branches: [ main, master ]

  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

5. Explanation of Each Section

name: Playwright Tests

name: Playwright Tests

This is the workflow's display name.

It is the name you will see in the Actions tab on GitHub.

It does not name an individual test or change how Playwright executes
tests.

on:

on:
  push:
    branches: [ main, master ]

  pull_request:
    branches: [ main, master ]

This defines when the workflow should run.

push

push:
  branches: [ main, master ]

Runs the workflow when code is pushed to either main or master.

For example, pushing a commit directly to main can trigger the tests.

pull_request

pull_request:
  branches: [ main, master ]

Runs the workflow for pull-request activity targeting main or
master.

For example, if a developer creates a pull request to merge a feature
branch into main, GitHub can run the tests to check the proposed
changes.

Important: These branch filters refer to the target branch for pull
requests. They do not mean that every push to every feature branch will
trigger this workflow.

If your repository uses only main, you can usually remove master
from the list. Keep the names that your repository actually uses.

jobs:

jobs:
  test:

A workflow contains one or more jobs.

Here, test is the job's identifier. It groups the steps needed to run
the Playwright tests.

The identifier is chosen by us; it does not have to be named test.

timeout-minutes: 60

timeout-minutes: 60

Sets the maximum time allowed for the job to run: 60 minutes.

If the job exceeds this limit, GitHub cancels it.

This is a job-level timeout, not the timeout for an individual
Playwright test or assertion. Playwright has its own timeout settings in
its configuration.

runs-on: ubuntu-latest

runs-on: ubuntu-latest

Tells GitHub to run this job on a GitHub-hosted Ubuntu Linux machine.

Think of it as a temporary computer supplied by GitHub for this job.

The runner starts with its own environment. It does not automatically
have your local project's files, installed npm packages, browser setup,
or local environment variables.

That is why the workflow checks out the repository and installs what it
needs.

6. Understanding the Steps

Steps run in the order in which they are listed. If a required step
fails, later steps normally do not run unless their conditions allow
them to run.

Step 1 --- Check out the repository

- uses: actions/checkout@v4

This action checks out the repository's code onto the GitHub runner.

Without the project files, the runner would not have the Playwright
tests, configuration, or package.json needed to run the tests.

Mental model: Get the repository's code onto the temporary machine.

Step 2 --- Set up Node.js

- uses: actions/setup-node@v4
  with:
    node-version: lts/*

Playwright projects using JavaScript or TypeScript need Node.js.

actions/setup-node@v4 installs/configures Node.js for the job.

node-version: lts/* requests the latest available Node.js release in
the LTS line supported by the setup action.

LTS means Long-Term Support.

If a project needs a specific Node.js version, use the version the
project supports rather than changing versions without checking
compatibility.

Step 3 --- Install project dependencies

- name: Install dependencies
  run: npm ci

This runs npm ci in the repository.

It installs the dependencies defined by the project's npm lockfile,
normally package-lock.json.

Why use npm ci in CI?

It is intended for clean automated installs.

It uses the lockfile to reproduce the dependency versions.

It fails if the lockfile and package.json are inconsistent.

It removes an existing node_modules folder before installing.

Important: Commit package-lock.json to the repository when using
this workflow.

npm ci installs the npm packages; it does not, by itself, guarantee
that all Playwright browser binaries and operating-system dependencies
are installed.

Step 4 --- Install Playwright browsers and system dependencies

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

Playwright needs browser binaries to execute browser tests.

This command installs the Playwright browsers and, on supported Linux
systems, the required operating-system dependencies.

The --with-deps option is particularly useful on a clean Ubuntu runner
because the runner may not have every library needed by the browsers.

The browsers installed depend on the Playwright version and the command
used. Playwright's browser versions are tied to its installed package
version.

Mental model: Install the browsers and supporting system libraries
that Playwright needs on this machine.

Step 5 --- Run the tests

- name: Run Playwright tests
  run: npx playwright test

This executes the Playwright Test suite using the project's Playwright
configuration and test discovery settings.

It is essentially the same test command you can run locally:

npx playwright test

If the tests pass, the step normally succeeds. If the test command exits
with a failure, GitHub marks the step and usually the job as failed.

Important: This command uses the project's normal Playwright
configuration. It does not automatically use the separate Azure service
configuration unless you specify it.

For example, to run with a separate Azure configuration, the command
would need to name it:

npx playwright test --config=playwright.service.config.js

That is a different execution setup. The workflow shown in these notes
runs npx playwright test, so it normally uses the default Playwright
configuration.

Step 6 --- Upload the report as an artifact

- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30

This action uploads the specified folder from the runner and attaches it
to the GitHub Actions run as an artifact.

name: playwright-report

name: playwright-report

Sets the artifact's display name.

You will see this name when downloading artifacts from the workflow run.

path: playwright-report/

path: playwright-report/

Tells the action which folder to upload.

This must match the location where the Playwright HTML reporter actually
writes its output.

The standard Playwright HTML reporter commonly uses
playwright-report/, but the output directory can be changed in
playwright.config.js.

If the folder does not exist or contains no files, there may be nothing
useful to upload. Check the Playwright reporter configuration and the
upload step's logs if the artifact is missing or empty.

retention-days: 30

retention-days: 30

Requests that the artifact be retained for 30 days, subject to the
repository or organization retention policies.

The artifact is not a permanent archive.

if: ${{ !cancelled() }}

if: ${{ !cancelled() }}

This condition allows the upload step to run when the job has not been
cancelled.

It can allow the report to be uploaded after a test step fails, which is
useful because failed tests are often the tests for which we most need a
report.

However, this condition does not guarantee that the upload will succeed.
For example, the runner could have been cancelled or the report folder
might not exist.

7. What Is an Artifact?

An artifact is a file or collection of files saved from a workflow
run so that you can download them later.

In this workflow, the artifact is intended to contain the Playwright
HTML report.

Why is this useful?

Imagine a test fails on GitHub Actions while running on Ubuntu. You may
not be able to reproduce the exact failure immediately on your own
machine.

Downloading the report can help you inspect:

Which test failed

The error message

The failed assertion

The test steps

Screenshots or other diagnostic information, if configured and
available

An artifact is not the same thing as a test result summary. The workflow
log shows execution output; the artifact preserves the files you chose
to upload.

Important: The current workflow uploads the playwright-report/
folder. It does not automatically upload every screenshot, video, or
trace that Playwright might generate in other folders. Those files need
to be included in the configured upload paths if you want to retain them
as artifacts.

8. How Does GitHub Know Whether the Tests Passed?

The result of the command matters:

run: npx playwright test

When Playwright finishes, it returns an exit code.

Exit code 0: The command succeeded.

Non-zero exit code: The command failed, for example because
tests failed or the command could not execute.

GitHub Actions uses this result to mark the step and job as successful
or failed.

A successful workflow is a useful signal, but it does not prove that
every possible application behavior is correct. It only confirms that
the configured workflow completed successfully.

9. How to Add This Workflow to GitHub

Step 1

Create this file in the repository:

.github/workflows/playwright.yml

Step 2

Paste the workflow YAML into the file.

Step 3

Confirm that the repository contains the files the workflow expects,
particularly:

package.json
package-lock.json
playwright.config.js
tests/

The exact configuration and test folder names may differ in your
project.

Step 4

Commit and push the workflow file to GitHub.

For example:

git add .github/workflows/playwright.yml
git commit -m "Add Playwright GitHub Actions workflow"
git push

Step 5

Open the repository on GitHub and select the Actions tab.

Open the workflow run triggered by the push or pull request.

Inspect the job and its steps to see which ones passed or failed.

If the workflow fails, open the failed step and read its logs before
changing the configuration.

10. How to Download the Playwright Report

After the workflow runs:

Open the repository on GitHub.

Select Actions.

Open the relevant workflow run.

Find the Artifacts section.

Download playwright-report.

Extract the downloaded archive.

Open the HTML report using the appropriate local method for your
setup.

The artifact is available only for its configured retention period and
subject to repository policies.

If no artifact appears, check whether the upload step ran, whether
playwright-report/ was created, and whether the upload step logged an
error.

11. Common Problems and Troubleshooting

Problem                             What to check

Workflow does not run               Confirm the file is under
.github/workflows/ and the
event/branch matches the workflow
triggers.

npm ci fails                      Confirm package.json and
package-lock.json are committed
and consistent.

Playwright cannot find a browser    Check the installed Playwright
version and the
browser-installation step.

Tests pass locally but fail on      Check OS differences, environment
GitHub                              variables, timing, test data, URLs,
and browser-specific behavior.

Tests time out                      Check Playwright timeouts, test
stability, application
availability, and runner/job
timeout settings.

Report artifact is missing          Check whether the upload step ran
and whether playwright-report/
exists and contains files.

Artifact uploads but has no useful  Confirm the HTML reporter is
report                              configured and writes to the
uploaded path.

Local success does not guarantee CI success

GitHub's Ubuntu runner is a different environment from a Windows
development machine.

Potential differences include:

Operating system and installed libraries

Environment variables and secrets

Network access and application availability

File paths and case sensitivity

Timing and parallel execution

Browser dependencies

When investigating a failure, identify the first failed step and its
exact error. Fix that issue before changing unrelated parts of the
workflow.

12. Important Difference: GitHub Actions vs Azure Playwright Workspaces

These services solve related but different problems.

GitHub Actions

GitHub Actions automates the workflow:

Checkout code
    ↓
Install Node.js dependencies
    ↓
Install browsers
    ↓
Run tests
    ↓
Upload artifacts

In the workflow documented here, the tests run on a GitHub-hosted Ubuntu
runner.

Azure Playwright Workspaces

Azure Playwright Workspaces provides managed remote browsers and its own
reporting integration.

A test run using Azure Workspaces can send browser execution and
reporting to that service when the project is configured for it.

Can they be used together?

Yes. GitHub Actions can trigger tests that use Azure Playwright
Workspaces. In that setup, GitHub Actions is the automation runner,
while Azure Workspaces provides the remote browser service.

However, the workflow in this document currently runs:

npx playwright test

That command uses the default Playwright configuration. It does not
automatically use playwright.service.config.js.

To execute tests through Azure Workspaces, you would need to configure
the workflow to use the Azure configuration and provide the required
authentication and service URL securely.

Do not assume that enabling Azure reporting in the local setup
automatically configures GitHub Actions.

13. Security Notes for Future Changes

If the workflow later needs credentials, tokens, or other secrets:

Store secrets in GitHub Actions Secrets or the appropriate GitHub
environment.

Reference them through the supported GitHub Actions secrets
mechanism.

Never commit passwords, access tokens, or private credentials to the
repository.

Avoid printing secret values in logs.

Give automation identities only the permissions they need.

The current workflow does not explicitly define any secrets. If tests
need to access a protected test environment, authentication may need to
be configured separately.

14. Quick Reference --- What Each Line Means

YAML                                Meaning

name                              Workflow display name

on.push                           Run when matching code is pushed

on.pull_request                   Run for matching pull-request
activity

branches                          Branch filters for the configured
events

jobs                              Groups the work to perform

timeout-minutes                   Maximum duration for the job

runs-on                           Machine/operating system used by
the job

actions/checkout@v4               Checks out repository files

actions/setup-node@v4             Sets up Node.js

npm ci                            Installs dependencies from the
lockfile

playwright install --with-deps    Installs Playwright browsers and
supported system dependencies

playwright test                   Runs the Playwright test suite

actions/upload-artifact@v4        Saves selected files from the run

if: ${{ !cancelled() }}           Allows the upload step when the job
has not been cancelled

path                              Folder/files to upload

retention-days                    Requested artifact retention period

15. Final Mental Model

Remember these four things:

GitHub Actions decides when and where the automated workflow
runs.

The workflow YAML defines the steps to execute.

Playwright runs the browser tests.

Artifacts preserve selected output, such as the HTML report, so
it can be downloaded later.

The overall process is:

Code pushed / pull request opened
                ↓
         GitHub Actions
                ↓
       Prepare Ubuntu runner
                ↓
       Install dependencies
                ↓
       Install Playwright browsers
                ↓
        Execute Playwright tests
                ↓
        ┌───────┴────────┐
        ↓                ↓
      Passed           Failed
        └───────┬────────┘
                ↓
      Upload report if possible
                ↓
       Inspect result on GitHub

Purpose: Automatically validate changes, detect regressions early,
and preserve a report that helps us investigate failures.