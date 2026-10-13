# QAOps --- Practical Engineering Standards & Future Reference

> **Purpose:** A practical reference for the quality and operational
> rules that help teams prevent risky code from being merged or
> released.
>
> **Focus:** Pull-request (PR) rules, branch protection, quality gates,
> automated testing, CI/CD checks, test evidence, release safety, and
> ongoing QAOps practices.
>
> **Scope:** Platform-neutral concepts, with GitHub examples. Similar
> controls exist in GitLab and Azure DevOps, although the names and
> configuration screens differ.

------------------------------------------------------------------------

## 1. What Is QAOps?

**QAOps combines software quality practices with DevOps automation.**
The goal is to make quality checks a normal, repeatable part of software
delivery rather than something performed only at the end.

A typical flow is:

``` text
Developer creates a branch
        ↓
Developer commits code
        ↓
Pull request is opened
        ↓
Automated quality checks run
        ↓
Review + required checks + security gates
        ↓
Merge is allowed only when required rules pass
        ↓
Post-merge build / deployment pipeline
        ↓
Smoke tests and monitoring
```

QAOps is not just writing automated tests. It also includes deciding: -
Which checks must pass before code can merge. - Who must review and
approve a change. - Which failures block a release. - How test evidence
is retained. - How test environments and secrets are managed. - How
defects and production incidents feed back into testing. - How teams
monitor the effectiveness of quality gates.

**Core principle:** Automate repeatable checks, make failures visible,
and prevent unsafe changes from moving forward.

------------------------------------------------------------------------

## 2. Pull Request (PR) Rules --- The Most Important Quality Gate

A PR proposes changes to a protected branch, such as `main`. The team
reviews the changes before merging them.

A PR should not be considered ready just because the code compiles or
one test passes.

### Recommended merge requirements

For a typical application repository, consider requiring:

-   [ ] At least one approval from an authorized reviewer.
-   [ ] All required CI checks pass.
-   [ ] Required Playwright smoke/regression checks pass.
-   [ ] No unresolved review conversations, if the team uses this rule.
-   [ ] The branch is up to date with the target branch, if required.
-   [ ] Required security/dependency checks pass.
-   [ ] The change has appropriate test coverage for its risk.
-   [ ] No secrets or credentials are committed.
-   [ ] Database migrations/configuration changes are reviewed when
    applicable.
-   [ ] The PR description explains the change and includes testing
    evidence.

Not every repository needs every rule. Choose rules based on risk, team
size, application criticality, and pipeline reliability.

### Important distinction

**A checklist in a document does not enforce anything.** To disable
merging until required conditions are met, configure branch protection
or a repository ruleset in the source-control platform.

------------------------------------------------------------------------

## 3. GitHub --- Enforce Rules Before Merge

On GitHub, use **branch protection rules** or **repository rulesets**
for the target branch.

Typical location:

``` text
Repository
    ↓
Settings
    ↓
Branches or Rules → Rulesets
    ↓
Protect the main branch
```

The exact menu labels may change.

### Recommended GitHub settings

**A. Require a pull request before merging**

Require a PR before changes can be merged into `main`. This prevents
ordinary direct pushes to the protected branch and makes review part of
the workflow.

**B. Require approvals**

Set a minimum number of approving reviews, such as one. For higher-risk
repositories, two approvals may be appropriate. Consider requiring
code-owner approval for sensitive areas.

An approval is not a substitute for automated tests; both may be
required.

**C. Require status checks to pass**

Select the CI checks that must pass before merging. Examples: - `lint` -
`unit-tests` - `api-tests` - `playwright-smoke-tests` - `build` -
`security-scan`

The required check names must match the actual checks reported by the
workflow. Run the workflow at least once if necessary so GitHub can
identify the check names.

**Important:** Do not mark a check as required if it never runs for the
PR event or if its job can be skipped in a way that leaves the
requirement unsatisfied.

**D. Require conversation resolution**

If enabled, review conversations must be resolved before merging. This
helps ensure that requested changes and reviewer concerns are addressed.

**E. Require branches to be up to date**

This requires the PR branch to include the latest target-branch changes
before merging, according to the configured rules. It can reduce
integration surprises, but may trigger additional builds and
rebases/merges.

**F. Block force pushes and branch deletion**

Protect the main branch from being rewritten or deleted accidentally.

**G. Restrict bypass permissions**

Decide who, if anyone, may bypass the rules. Keep bypass access limited
and auditable.

**H. Apply rules to administrators where appropriate**

If administrators can bypass requirements, the process may be less
reliable. Choose the setting that fits the team's governance needs.

### What happens when a required check fails?

``` text
PR opened
   ↓
Required checks run
   ↓
One required check fails
   ↓
PR is blocked from merging
   ↓
Developer fixes the problem
   ↓
Checks run again
   ↓
All required checks pass + approvals complete
   ↓
Merge becomes available
```

The platform may still show a merge button in some states, but it should
indicate that merging is blocked or disallowed while required rules
remain unsatisfied. Exact UI behavior depends on the platform and
repository settings.

------------------------------------------------------------------------

## 4. Example: Required Checks in a GitHub Actions Workflow

GitHub branch protection does not automatically know that a workflow is
important. Configure the workflow to report meaningful checks, then
select the relevant check names in branch protection/ruleset settings.

A simple workflow can separate checks into jobs:

``` yaml
name: PR Quality Gate

on:
  pull_request:
    branches: [main]

  push:
    branches: [main]

jobs:
  lint:
    name: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npm run lint

  unit-tests:
    name: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npm test

  playwright-smoke-tests:
    name: playwright-smoke-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --grep @smoke
```

This is an illustrative template, not a drop-in workflow for every
project. It assumes `lint` and `test` npm scripts exist and that smoke
tests use the `@smoke` tag. Adjust commands to match the repository.

After the checks run, configure the matching checks as required in
branch protection/ruleset settings.

**Quality-gate design tip:** Keep required checks reliable and
reasonably fast. Put longer, broader regression suites in a separate
stage if the team does not need every test to run before every PR merge.
Base the decision on risk, not just speed.

------------------------------------------------------------------------

## 5. Define a Testing Strategy for Each Change

Different tests answer different questions. Avoid treating a single test
suite as proof that everything works.

  -----------------------------------------------------------------------
  Test layer              What it checks          Typical role in PRs
  ----------------------- ----------------------- -----------------------
  Static analysis / lint  Style, suspicious code, Usually required
                          basic errors            

  Unit tests              Small units of logic    Usually required

  API/integration tests   Interfaces, services,   Required where relevant
                          data interactions       

  UI smoke tests          Critical user journeys  Often required

  Full UI regression      Broader end-to-end      PR or
                          behavior                scheduled/post-merge,
                                                  depending on duration
                                                  and risk

  Performance tests       Response times and      Usually scheduled or
                          throughput under load   release-focused

  Security scans          Vulnerabilities,        Required according to
                          secrets, dependency     policy/risk
                          risks                   

  Accessibility checks    Selected accessibility  Include in PR/release
                          issues                  gates where applicable

  Manual exploratory      Unexpected behavior and Risk-based; not fully
  testing                 usability risks         replaced by automation
  -----------------------------------------------------------------------

### Risk-based testing

Not every change needs every test.

-   A typo in static content may need a small smoke check.
-   A payment flow change may require unit, API, UI, security, and
    regression coverage.
-   A database migration may need migration validation and
    backward-compatibility checks.
-   Authentication changes should receive stronger security and
    negative-path testing.

Document which test levels are required for different types of changes.

------------------------------------------------------------------------

## 6. Keep PRs Small, Reviewable, and Testable

Good PR practices make QA and code review more effective.

-   One logical change per PR where practical.
-   Use a descriptive title.
-   Explain what changed and why.
-   Describe how it was tested.
-   Link the related issue or work item.
-   Attach screenshots/video for meaningful UI changes when helpful.
-   Mention migrations, configuration changes, feature flags, and
    deployment dependencies.
-   Identify known limitations or follow-up work.
-   Avoid mixing unrelated refactoring with a risky feature unless
    necessary.

### Example PR template

Create `.github/pull_request_template.md`:

``` markdown
## Summary
What changed and why?

## Related ticket
Link the issue/work item.

## Testing performed
- [ ] Unit tests
- [ ] API/integration tests
- [ ] Playwright tests
- [ ] Manual testing (if applicable)

## Risk and impact
Which areas could be affected?

## Evidence
Screenshots, videos, logs, or report links if useful.

## Deployment considerations
Configuration, migration, feature flag, or rollback notes.

## Checklist
- [ ] Tests added/updated where needed
- [ ] No secrets committed
- [ ] Documentation updated where needed
```

A template encourages good information, but it does not enforce checks.
Use CI and branch protection for enforcement.

------------------------------------------------------------------------

## 7. Test Quality and Flaky-Test Management

A test that randomly fails is not a reliable quality gate.

Recommended practices: - Use stable locators and meaningful
assertions. - Avoid arbitrary sleeps when Playwright's auto-waiting or
condition-based waits can be used. - Keep test data controlled and
independent. - Clean up created data where appropriate. - Avoid
depending on test execution order. - Capture traces, screenshots, and
videos where useful. - Track flaky tests and their owners. - Fix or
quarantine known flaky tests through a documented, time-limited process.

**Do not silently ignore failures or make retries the permanent
solution.** Retries can help diagnose intermittent failures, but a test
that only passes on retry still deserves investigation.

If a test is temporarily excluded from a blocking gate, record why, who
owns the fix, and the target date for restoring it.

------------------------------------------------------------------------

## 8. Environment and Test-Data Management

CI results are useful only if the test environment is understood.

Define: - Which environment each pipeline targets. - How test accounts
and credentials are created. - How test data is seeded and cleaned up. -
Which services must be available. - How environment variables are
configured. - How deployments and test execution are coordinated. - What
happens if a dependency or environment is unavailable.

### Essential rules

-   Never commit passwords, tokens, or client secrets.
-   Use platform secret stores or an approved identity mechanism.
-   Use least-privilege permissions for automation identities.
-   Separate development, staging, and production credentials.
-   Avoid running destructive tests against production.
-   Make tests repeatable and safe to rerun.
-   Keep sensitive data out of reports and logs.

For GitHub Actions, use repository/environment secrets or an appropriate
identity federation approach. For Azure, consider workload identity
federation/OIDC where supported rather than maintaining long-lived
client secrets.

------------------------------------------------------------------------

## 9. CI/CD Quality Gates Beyond the PR

Quality does not stop when a PR is merged.

``` text
Pull request
    ↓
Lint + unit + selected integration/UI tests
    ↓
Review and required checks
    ↓
Merge to main
    ↓
Build/package
    ↓
Deploy to test/staging
    ↓
Smoke + integration + broader regression tests
    ↓
Release approval / policy checks, if required
    ↓
Production deployment
    ↓
Post-deployment smoke tests
    ↓
Monitoring and incident feedback
```

The precise stages vary by application and team.

### Post-deployment validation

After a deployment, verify critical paths such as: - Application starts
and responds. - Login works. - Important APIs respond correctly. - Core
business journeys work. - Required dependencies are healthy.

A deployment completing successfully does not prove that the application
is behaving correctly.

### Rollback and recovery

For critical systems, define: - Who can stop a release. - What signals
trigger rollback. - How to roll back or disable a feature. - How to
verify recovery. - How to communicate an incident. - How to preserve
evidence for investigation.

A rollback strategy should be designed and tested, not improvised during
an incident.

------------------------------------------------------------------------

## 10. Release Rules and Change Management

For production releases, consider requiring: - Successful build and
required test suites. - Approved change/release where the team's process
requires it. - Database migration and compatibility review where
applicable. - Configuration and secret readiness. - Monitoring/alerting
readiness. - A rollback or recovery plan for risky changes. - Clear
ownership for deployment and verification.

Avoid requiring manual approvals for every low-risk deployment if
automation can safely handle it. Apply controls proportionately to risk.

------------------------------------------------------------------------

## 11. Security and Supply-Chain Checks

Quality gates should also consider security.

Common checks include: - Secret scanning. - Dependency vulnerability
scanning. - Static application security testing (SAST). - Dynamic
application security testing (DAST), where appropriate. -
Container/image scanning if containers are used. - License-policy checks
where required. - Review of workflow permissions and third-party
actions.

### Rules to remember

-   Give CI jobs only the permissions they need.
-   Pin third-party actions according to the organization's security
    policy.
-   Protect secrets from untrusted pull-request code.
-   Do not expose deployment credentials to forked PRs.
-   Require review for changes to workflows, deployment scripts, and
    security configuration.
-   Rotate credentials if they are exposed.
-   Keep dependencies and runners updated.

Security tooling should be selected and configured to avoid excessive
false positives that teams learn to ignore.

------------------------------------------------------------------------

## 12. Code Ownership and Sensitive Areas

For repositories with multiple teams, use code ownership to identify
reviewers for specific paths.

Examples of sensitive areas: - Authentication and authorization. -
Payment logic. - CI/CD workflow files. - Infrastructure configuration. -
Database migrations. - Secrets and deployment configuration. - Shared
test frameworks and fixtures.

On GitHub, a `CODEOWNERS` file can request reviews from responsible
owners. Configure branch protection to require code-owner approval if
that is the intended policy.

Ownership should be clear so a required approval does not become an
unexplained bottleneck.

------------------------------------------------------------------------

## 13. Pipeline Reliability and Performance

A slow or unreliable pipeline encourages teams to bypass it.

Track: - PR pipeline duration. - Failure rate by job. - Flaky-test
rate. - Time spent waiting for runners. - Frequency of reruns. - Time to
diagnose and fix failures. - Deployment success and rollback rate.

Useful improvements: - Cache dependencies when safe and beneficial. -
Split independent jobs for parallel execution. - Run fast checks before
slow suites. - Use test sharding when supported and useful. - Avoid
running the entire regression suite unnecessarily on every small
change. - Keep test environments healthy. - Remove obsolete or
duplicated checks.

Do not optimize only for speed. A fast pipeline that misses important
defects is not an effective quality gate.

------------------------------------------------------------------------

## 14. What Should Block a Merge?

A useful starting policy for a typical application:

  -----------------------------------------------------------------------
  Condition               Block merge?            Notes
  ----------------------- ----------------------- -----------------------
  Required CI job fails   Yes                     Configure as a required
                                                  status check

  Required unit tests     Yes                     Keep the suite reliable
  fail                                            

  Critical smoke test     Usually yes             Select critical user
  fails                                           journeys

  Required review missing Yes                     Enforce through branch
                                                  rules

  Required code-owner     For protected paths     Configure where needed
  approval missing                                

  Secret detected in a    Yes, according to       Investigate and remove
  proposed change         security policy         it

  Critical/high security  According to agreed     Define severity and
  issue                   policy                  exception process

  Optional non-blocking   Usually no              Depends on its purpose
  report unavailable                              

  Known flaky test fails  Do not silently ignore  Investigate; use a
                                                  documented exception if
                                                  needed

  Full regression suite   Not necessarily         Consider post-merge or
  is too slow for every                           scheduled execution,
  PR                                              based on risk

  PR description          Only if enforced        A template alone is not
  checklist incomplete                            an enforcement
                                                  mechanism
  -----------------------------------------------------------------------

The team should agree on severity thresholds, exceptions, owners, and
escalation procedures.

------------------------------------------------------------------------

## 15. What Should Happen When a Gate Is Bypassed?

Sometimes an emergency requires an exception. An exception should not
become the normal process.

Define: - Who is authorized to bypass a rule. - Which situations justify
bypassing it. - How the reason is recorded. - Who approves the
exception. - Which checks must run afterward. - How the team tracks
follow-up remediation.

For important systems, audit bypass events and review them periodically.

------------------------------------------------------------------------

## 16. QAOps Metrics: Measure Effectiveness, Not Just Test Count

Useful metrics include: - Escaped defects: issues found after release
that should have been caught earlier. - Defect leakage by stage. -
Flaky-test rate. - Pipeline success/failure rate. - Time to feedback on
a PR. - Mean time to diagnose and recover from a failed deployment. -
Change failure and rollback rate. - Percentage of critical user journeys
covered by reliable automated checks.

Avoid treating code coverage or number of automated tests as proof of
quality by itself. Coverage can show what code was exercised, but not
whether the assertions were meaningful.

Use metrics to identify improvement opportunities, not to punish
individuals.

------------------------------------------------------------------------

## 17. Platform Mapping

The concepts are broadly the same across platforms, but their
implementation differs.

  -----------------------------------------------------------------------
  QAOps requirement GitHub            GitLab            Azure DevOps
  ----------------- ----------------- ----------------- -----------------
  Protect the main  Branch protection Protected         Branch policies
  branch            / rulesets        branches and      
                                      merge-request     
                                      rules             

  Require           Required status   Pipeline/merge    Build validation
  successful CI     checks            checks            policies

  Require reviewer  PR review rules / Merge-request     Required
  approval          CODEOWNERS        approvals /       reviewers and
                                      code-owner        branch policies
                                      support           

  Run CI            GitHub Actions    GitLab CI/CD      Azure Pipelines

  Store credentials Actions secrets / CI/CD variables   Pipeline
                    environments                        variables /
                                                        variable groups /
                                                        secure
                                                        integrations

  Keep test reports Actions artifacts Job artifacts and Published
                                      reports           pipeline
                                                        artifacts and
                                                        test results

  Define code       `CODEOWNERS`      Code-owner        Repository
  owners                              support,          policies and
                                      depending on      reviewer
                                      setup             configuration,
                                                        depending on
                                                        setup
  -----------------------------------------------------------------------

Exact capabilities depend on product edition, repository configuration,
permissions, and organizational policies. Verify the options available
in the team's actual platform.

------------------------------------------------------------------------

## 18. A Practical Adoption Plan

If setting up QAOps for a new project, start with a small set of
reliable controls.

### Phase 1 --- Protect the main branch

-   [ ] Require PRs.
-   [ ] Require at least one review.
-   [ ] Block direct pushes where appropriate.
-   [ ] Require the basic CI workflow to pass.
-   [ ] Restrict bypass permissions.

### Phase 2 --- Add essential quality checks

-   [ ] Lint/static analysis.
-   [ ] Unit tests.
-   [ ] Build validation.
-   [ ] Critical API/integration tests.
-   [ ] Playwright smoke tests.
-   [ ] Test report artifacts.

### Phase 3 --- Improve reliability and security

-   [ ] Manage secrets securely.
-   [ ] Add dependency and secret scanning.
-   [ ] Capture useful failure evidence.
-   [ ] Track and fix flaky tests.
-   [ ] Define test-data and environment practices.
-   [ ] Add code-owner approval for sensitive paths.

### Phase 4 --- Strengthen release safety

-   [ ] Run broader regression tests at the appropriate stage.
-   [ ] Deploy to a controlled test/staging environment.
-   [ ] Run post-deployment smoke tests.
-   [ ] Define release approvals based on risk.
-   [ ] Document rollback and incident procedures.
-   [ ] Monitor production and feed incidents back into testing.

### Phase 5 --- Review effectiveness

-   [ ] Measure pipeline time and failure rate.
-   [ ] Review escaped defects.
-   [ ] Remove obsolete checks.
-   [ ] Improve slow or flaky suites.
-   [ ] Review bypasses and exceptions.
-   [ ] Revisit policies as the project grows.

------------------------------------------------------------------------

## 19. Final Checklist --- Before Calling the Process Mature

-   [ ] Main branch is protected.
-   [ ] PRs require the agreed approvals.
-   [ ] Required CI checks are enforced by platform rules.
-   [ ] Critical tests are reliable and repeatable.
-   [ ] Failures provide actionable logs and evidence.
-   [ ] Secrets are stored securely and permissions follow least
    privilege.
-   [ ] Untrusted PRs cannot access deployment credentials.
-   [ ] Test environments and test data are managed.
-   [ ] Release validation and rollback procedures exist.
-   [ ] Bypasses and exceptions are recorded.
-   [ ] Pipeline reliability and escaped defects are reviewed.
-   [ ] The team regularly improves its quality gates.

------------------------------------------------------------------------

## Key Takeaways

1.  **A PR checklist does not block merging by itself.** Configure
    branch protection, rulesets, or branch policies.
2.  **Require checks that actually run and report reliably.** Select the
    correct status-check names in the platform.
3.  **Use risk-based gates.** Critical changes need stronger validation
    than low-risk changes.
4.  **A passing pipeline is evidence, not a guarantee.** Test design and
    production monitoring still matter.
5.  **Treat flaky tests as quality problems.** Do not make reruns or
    skipped tests a permanent workaround.
6.  **Protect credentials and deployment paths.** A secure pipeline is
    part of quality engineering.
7.  **Keep the process practical.** Too many slow or noisy gates can
    encourage teams to bypass them.
8.  **Learn the concepts once, then map them to each platform.** GitHub,
    GitLab, and Azure DevOps use different controls for similar
    governance goals.

**Mental model:** QAOps makes quality expectations explicit, automates
repeatable checks, blocks unsafe changes where appropriate, and learns
from failures after release.
