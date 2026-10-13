
# Azure Playwright Workspaces — Setup & Troubleshooting Notes

> **Purpose:** Run Playwright tests on Azure Playwright Workspaces using cloud browsers, parallel workers, and Azure reporting.
>
> **Environment:** Windows + PowerShell + VS Code + Playwright + Azure CLI

---

# 1. What We Are Setting Up

The goal is to run our normal Playwright tests using Azure's managed cloud browsers instead of only running them locally.

```text
Local Playwright Tests
        │
        ▼
playwright.service.config.js
        │
        ▼
Azure Playwright Workspaces
        │
        ├── Cloud Browser Execution
        │
        ├── Parallel Workers
        │
        └── Test Reporting
                │
                ▼
        Azure Storage Account
````

Azure Playwright Workspaces provides:

* Managed cloud browsers
* Parallel test execution
* Screenshots
* Videos
* Traces
* Test run reporting

---

# 2. Prerequisites

Before running the Azure Playwright tests, make sure these are available:

* Node.js
* npm
* Playwright
* Azure CLI
* Azure subscription
* Azure Playwright Workspace
* Azure Storage Account
* Azure authentication

---

# 3. Install Azure CLI

Azure CLI is required to authenticate with Azure from the terminal.

For our Windows setup, Azure CLI was extracted to:

```text
C:\Users\dicetek.arshad\azure-cli-2.91.0-x64\
```

The important folder is:

```text
C:\Users\dicetek.arshad\azure-cli-2.91.0-x64\bin
```

Add this `bin` folder to Windows User `PATH`.

### Verify Azure CLI

```powershell
az version
```

If the command works, Azure CLI is installed correctly.

---

# 4. Problem: `az` Is Not Recognized

### Error

```text
az is not recognized as the name of a cmdlet
```

### Cause

Azure CLI was installed, but its `bin` folder was not available in the current terminal's `PATH`.

### Temporary fix

Run this in PowerShell:

```powershell
$env:Path += ";C:\Users\dicetek.arshad\azure-cli-2.91.0-x64\bin"
```

Then verify:

```powershell
az version
```

### Permanent fix

Add this folder to Windows User PATH:

```text
C:\Users\dicetek.arshad\azure-cli-2.91.0-x64\bin
```

After changing the Windows PATH:

```text
Close VS Code
      ↓
Reopen VS Code
      ↓
Open a new terminal
      ↓
Run: az version
```

> **Important:** `$env:Path += ...` only changes the current PowerShell session.
> A new terminal may not have that temporary change.

---

# 5. Login to Azure

Try the normal login first:

```powershell
az login
```

If Azure requires additional interaction or the browser authentication does not work correctly, use:

```powershell
az login --use-device-code
```

Azure will provide a URL and device code.

Open the URL in a browser and enter the code.

### Verify the login

```powershell
az account show
```

This confirms which Azure account/subscription is currently active.

---

# 6. Azure Playwright Workspace

Create or select an Azure Playwright Workspace in Azure Portal.

Our workspace:

```text
playwrightlabarshad
```

The workspace provides the browser service endpoint required by Playwright.

---

# 7. Playwright Service URL

The Azure Playwright Workspace provides a WebSocket browser endpoint.

Our service URL:

```text
wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/823ce67d-9ab8-4559-9ad9-d146559d0533/browsers
```

---

## PowerShell Configuration

PowerShell uses `$env:` to set environment variables.

```powershell
$env:PLAYWRIGHT_SERVICE_URL="wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/823ce67d-9ab8-4559-9ad9-d146559d0533/browsers"
```

Verify:

```powershell
$env:PLAYWRIGHT_SERVICE_URL
```

It should print the service URL.

---

## Important: PowerShell vs Bash

### Linux/macOS

```bash
export PLAYWRIGHT_SERVICE_URL="..."
```

### Windows PowerShell

```powershell
$env:PLAYWRIGHT_SERVICE_URL="..."
```

> **Remember:** Do NOT use `export` in PowerShell.

---

# 8. Problem: `export` Is Not Recognized

### Error

```text
export : The term 'export' is not recognized...
```

### Cause

`export` is a Linux/macOS shell command.

### Fix for PowerShell

```powershell
$env:PLAYWRIGHT_SERVICE_URL="..."
```

---

# 9. Important: Environment Variables Are Session-Specific

When using:

```powershell
$env:PLAYWRIGHT_SERVICE_URL="..."
```

the variable exists in the **current PowerShell session**.

If a new VS Code terminal is opened, check again:

```powershell
$env:PLAYWRIGHT_SERVICE_URL
```

If nothing is returned, set it again:

```powershell
$env:PLAYWRIGHT_SERVICE_URL="wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/823ce67d-9ab8-4559-9ad9-d146559d0533/browsers"
```

---

# 10. Enable Playwright Workspace Reporting

In Azure Portal:

```text
Playwright Workspace
        ↓
Storage Configuration
        ↓
Reporting
        ↓
Enable
        ↓
Select/Create Storage Account
        ↓
Save
```

Our storage account:

```text
pwstrgarshlearning4e8a
```

Reporting allows Playwright to upload:

* Screenshots
* Videos
* Traces
* Test run artifacts

---

# 11. Storage Account

Our storage account:

```text
pwstrgarshlearning4e8a
```

Resource group:

```text
ARSH_Learning
```

The storage account resource ID follows this format:

```text
/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>
```

---

# 12. Storage Blob Data Contributor Role

The Azure account needs the appropriate permission to upload Playwright reporting artifacts to the storage account.

Required role:

```text
Storage Blob Data Contributor
```

This is the role we used successfully.

---

# 13. Find Storage Accounts Using Azure CLI

```powershell
az storage account list --query "[].{Name:name, ResourceGroup:resourceGroup, ID:id}" -o table
```

This helps identify the storage account and its Resource ID.

---

# 14. Problem: Storage Blob Data Contributor Not Visible

While searching for the role in Azure Portal, another role may appear:

```text
Storage Actions Blob Data Operator
```

Do NOT assume this is the same role.

The role required for our setup is:

```text
Storage Blob Data Contributor
```

If the correct role is difficult to find in the Portal UI, use Azure CLI.

---

# 15. Find the Azure User Object ID

If role assignment using the email address does not work, get the Object ID of the currently signed-in Azure user.

Run:

```powershell
az ad signed-in-user show --query id -o tsv
```

Example:

```text
7ab6a7fb-ba22-4184-9759-5f7fee0a09f9
```

---

# 16. Problem: Email Cannot Be Found for Role Assignment

Sometimes this may fail:

```powershell
--assignee "email@example.com"
```

with an error similar to:

```text
Cannot find user or service principal in graph database
```

### Fix

Use the Azure Object ID instead of the email address:

```powershell
az ad signed-in-user show --query id -o tsv
```

Then use that Object ID with `--assignee`.

---

# 17. Assign Storage Blob Data Contributor

Command:

```powershell
az role assignment create `
  --assignee "<USER_OBJECT_ID>" `
  --role "Storage Blob Data Contributor" `
  --scope "<STORAGE_ACCOUNT_RESOURCE_ID>"
```

Example:

```powershell
az role assignment create `
  --assignee "7ab6a7fb-ba22-4184-9759-5f7fee0a09f9" `
  --role "Storage Blob Data Contributor" `
  --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```

---

# 18. Verify the Role Assignment

```powershell
az role assignment list `
  --assignee "<USER_OBJECT_ID>" `
  --scope "<STORAGE_ACCOUNT_RESOURCE_ID>" `
  --output table
```

Confirm that the assigned role is:

```text
Storage Blob Data Contributor
```

---

# 19. Playwright Azure Service Configuration (Auto Created)

We use a separate configuration file for Azure execution:

```text
playwright.service.config.js
```

Example:

```javascript
const { defineConfig } = require("@playwright/test");
const {
  createAzurePlaywrightConfig,
  ServiceOS,
} = require("@azure/playwright");
const { DefaultAzureCredential } = require("@azure/identity");

const config = require("./playwright.config");

module.exports = defineConfig(
  config,

  createAzurePlaywrightConfig(config, {
    exposeNetwork: "<loopback>",
    connectTimeout: 3 * 60 * 1000,
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential(),
  }),

  {
    reporter: [
      ["html", { open: "never" }],
      ["@azure/playwright/reporter"],
    ],
  }
);
```

---

# 20. What the Azure Configuration Does

### `createAzurePlaywrightConfig()`

Connects our existing Playwright configuration to Azure Playwright Workspaces.

### `ServiceOS.LINUX`

Requests Linux-based cloud browsers.

### `DefaultAzureCredential`

Uses Azure authentication available on the machine.

Since we already logged in using:

```powershell
az login
```

Azure CLI credentials can be used by the credential chain.

### `connectTimeout`

Controls how long Playwright waits while connecting to the Azure service.

### Azure Reporter

```javascript
["@azure/playwright/reporter"]
```

Sends Playwright test results to Azure Playwright Workspaces.

---

# 21. Run Tests on Azure

Before running the test, make sure the service URL exists:

```powershell
$env:PLAYWRIGHT_SERVICE_URL
```

If it is empty, set it:

```powershell
$env:PLAYWRIGHT_SERVICE_URL="wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/823ce67d-9ab8-4559-9ad9-d146559d0533/browsers"
```

Then run:

```powershell
npx playwright test --config=playwright.service.config.js --workers=4
```

---

# 22. Parallel Workers

The `--workers` option controls how many Playwright workers execute tests in parallel.

Example:

```powershell
npx playwright test --config=playwright.service.config.js --workers=4
```

This uses:

```text
4 workers
```

For high-scale execution:

```powershell
npx playwright test --config=playwright.service.config.js --workers=20
```

> Start with a smaller number such as `4` while validating the setup.
> Increase workers when you actually need higher parallel execution.

---

# 23. Successful Azure Test Run

The final setup was successfully verified using:

```powershell
npx playwright test --config=playwright.service.config.js --workers=4
```

The terminal confirmed:

```text
Running tests using Playwright workspaces.

Test run created successfully.

Playwright Workspaces reporting: ENABLED

Collecting artifacts: screenshots, videos, traces.

Uploading artifacts to:
storage account= pwstrgarshlearning4e8a

Reporting upload status: SUCCESS
```

Azure also generated:

```text
Published report URL
```

This confirms that the complete setup is working.

---

# 24. What Was Successfully Verified

The successful run confirms:

```text
Azure CLI Authentication          ✅
        ↓
Playwright Workspace Connection   ✅
        ↓
Cloud Browser Execution           ✅
        ↓
Parallel Workers                  ✅
        ↓
Screenshot / Video / Trace        ✅
        ↓
Azure Storage Upload              ✅
        ↓
Azure Playwright Reporting        ✅
```

---

# 25. View the Local HTML Report

After a Playwright run, the terminal may show:

```text
To open last HTML report run:

npx playwright show-report
```

Run:

```powershell
npx playwright show-report
```

This opens the local Playwright HTML report.

Azure reporting is separate and provides the Azure Playwright Workspace test run/report.

---

# 26. Troubleshooting Quick Reference

| Problem                                           | Cause                                    | Fix                                       |
| ------------------------------------------------- | ---------------------------------------- | ----------------------------------------- |
| `az` is not recognized                            | Azure CLI not in PATH                    | Add Azure CLI `bin` folder to PATH        |
| New terminal cannot find `az`                     | Temporary PATH was session-specific      | Restart VS Code or add PATH permanently   |
| `export` is not recognized                        | Using Bash syntax in PowerShell          | Use `$env:VARIABLE="value"`               |
| `az login` needs interaction                      | Authentication flow issue                | Use `az login --use-device-code`          |
| Service URL not set                               | Environment variable missing             | Set `$env:PLAYWRIGHT_SERVICE_URL="..."`   |
| Service URL works in one terminal but not another | Environment variable is session-specific | Set it again in the new terminal          |
| Storage role not visible                          | Portal role search issue                 | Use Azure CLI                             |
| Email cannot be resolved                          | Entra ID lookup issue                    | Use Azure Object ID                       |
| Reporting upload fails                            | Storage permissions/configuration        | Check `Storage Blob Data Contributor`     |
| Azure test connection fails                       | Service URL/config/authentication issue  | Verify URL, `az account show`, and config |

---

# 27. Final Setup Flow

```text
Install Azure CLI
        ↓
Add Azure CLI bin folder to PATH
        ↓
Verify: az version
        ↓
Login:
az login --use-device-code
        ↓
Verify:
az account show
        ↓
Create / Select Azure Playwright Workspace
        ↓
Get Playwright Service URL
        ↓
Set PLAYWRIGHT_SERVICE_URL
        ↓
Enable Workspace Reporting
        ↓
Create / Select Storage Account
        ↓
Assign Storage Blob Data Contributor
        ↓
Configure playwright.service.config.js
        ↓
Run Playwright tests
        ↓
Azure cloud browser execution
        ↓
Upload screenshots / videos / traces
        ↓
Azure Playwright Workspace Report
```

---

# 28. Most Important Future Reminders

### PowerShell

```powershell
$env:VARIABLE="value"
```

NOT:

```bash
export VARIABLE="value"
```

---

### Azure Login

```powershell
az login --use-device-code
```

---

### Check Azure Account

```powershell
az account show
```

---

### Check Azure CLI

```powershell
az version
```

---

### Check Playwright Service URL

```powershell
$env:PLAYWRIGHT_SERVICE_URL
```

---

### Set Playwright Service URL

```powershell
$env:PLAYWRIGHT_SERVICE_URL="wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers"
```

---

### Required Storage Role

```text
Storage Blob Data Contributor
```

---

### If Email Does Not Work

Get Object ID:

```powershell
az ad signed-in-user show --query id -o tsv
```

Use the Object ID for:

```powershell
--assignee "<OBJECT_ID>"
```

---

### Run Azure Playwright Tests

```powershell
npx playwright test --config=playwright.service.config.js --workers=4
```

---

### Open Local Playwright Report

```powershell
npx playwright show-report
```

---

# 29. Current Working Setup

At the end of this setup, the following are working successfully:

```text
OS:
Windows

Terminal:
PowerShell

IDE:
VS Code

Azure CLI:
2.91.0

Azure Workspace:
playwrightlabarshad

Storage Account:
pwstrgarshlearning4e8a

Reporting:
Enabled

Storage Role:
Storage Blob Data Contributor

Playwright Service:
Azure Playwright Workspaces

Test Execution:
Successful

Reporting Upload:
SUCCESS

Artifacts:
Screenshots + Videos + Traces

Workers Tested:
4
```

> **Setup Status: COMPLETE ✅**
>
> The Azure Playwright Workspace integration has been successfully configured and verified with a real Playwright test run.

