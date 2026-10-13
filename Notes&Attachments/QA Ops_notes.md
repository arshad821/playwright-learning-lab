# Playwright + Azure DevOps Cloud

## Connect Playwright Project to Azure DevOps

### 1. Push Project to Azure Repos

```bash
git init
git add .
git commit -m "Initial Playwright automation framework"
git remote add origin <AZURE_REPO_URL>
git push -u origin main
````

---

### 2. Create Azure Pipeline

Create this file in the **root of the Playwright project**:

```text
azure-pipelines.yml
```

Basic pipeline:

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:

- task: NodeTool@0
  inputs:
    versionSpec: '20.x'
  displayName: 'Install Node.js'

- script: npm ci
  displayName: 'Install dependencies'

- script: npx playwright install --with-deps
  displayName: 'Install Playwright browsers'

- script: npx playwright test
  displayName: 'Run Playwright tests'
```

---

### 3. Pipeline Flow

```text
Azure Repos
     ↓
Azure Pipeline triggered
     ↓
Install Node.js
     ↓
npm ci
     ↓
Install Playwright browsers
     ↓
Run Playwright tests
     ↓
Test results / reports
```

---

### 4. Important Commands

Run all tests:

```bash
npx playwright test
```

Run specific project:

```bash
npx playwright test --project=Chromium
```

Run smoke tests:

```bash
npx playwright test --grep @smoke
```

Open HTML report locally:

```bash
npx playwright show-report
```

---

### 5. Key Concepts

**Azure Repos**
→ Stores the Playwright source code.

**Azure Pipelines**
→ Automates the Playwright test execution.

**Agent**
→ Machine where the pipeline actually runs the tests.

**`azure-pipelines.yml`**
→ Configuration file that tells Azure DevOps what to execute.

**`npm ci`**
→ Installs dependencies from `package-lock.json`.

**`npx playwright install --with-deps`**
→ Installs Playwright browsers and required dependencies.

**`npx playwright test`**
→ Executes the Playwright tests.

### Mental Model

```text
Code → Azure Repos
          ↓
      Pipeline
          ↓
       Agent
          ↓
     Playwright
          ↓
       Tests
          ↓
   Reports / Results
```

```
```



Steps to config Azure Devops

'1. Run your Playwright tests using Azure cloud browsers

Follow the setup steps on your current Azure page:

Install the Azure Playwright package.
Configure authentication.
Add the cloud browser endpoint.
Run your tests against the cloud browsers.

Official guide: Playwright Workspaces setup

2. Automatically run tests through Azure DevOps

If you want tests to execute automatically whenever you push code to your repository, configure an Azure Pipeline using azure-pipelines.yml.

You don't need to manually create every test step through the Azure DevOps interface; the YAML file defines the pipeline steps.
'
