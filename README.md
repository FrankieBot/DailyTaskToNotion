# Notion Daily TODO Automator

This project uses Google Apps Script to interact with the Notion API. It automatically adds daily TODO tasks to Notion at midnight if the task was completed on the previous day.

## Features

- **Daily Automation**: Adds new TODO tasks at midnight every day.
- **Task Verification**: Only adds new tasks if the previous day's tasks are completed.
- **Google Apps Script Integration**: Runs entirely on Google Apps Script.

## Prerequisites

- A Notion account with access to the relevant database.
- Google Apps Script set up with access to your Google account.
- Notion API integration with a token and database ID.

# Notion Daily TODO Automator

This project uses Google Apps Script to interact with the Notion API and automatically add daily TODO tasks to a Notion database.

**What changed**: the script now reads Notion credentials from Script Properties and includes helper functions to set/clear them (`setNotionConfig`, `clearNotionConfig`). The main function is `addDailyTasks()`.

## Prerequisites

- A Notion account and a Notion database where tasks will be added.
- A Notion integration (secret token) and the database ID.
- A Google account to run Google Apps Script.

## Setup

1. Create a Notion integration and copy the internal integration token (secret).
2. Share the target database with the integration (open your database > Share > invite the integration).
3. Get the database ID:
   - Open the database in Notion, copy the URL, and extract the ID (the long UUID at the end of the URL).

## Install / Deploy in Google Apps Script

1. Open Google Apps Script (script.google.com) and create a new project.
2. Copy the files from this repository into the Apps Script editor (replace the default Code.gs with `コード.js` contents if necessary).

## Configure credentials

Two options to set credentials:

- Option A (recommended): Run the helper from the Apps Script editor once.

  1. Open the script in the editor.
  2. In the left file list open `コード.js`, then open the "Executions" / run menu and choose `setNotionConfig`.
  3. When prompted, pass your Notion token and database id as arguments: e.g. run `setNotionConfig('secret_api_key', 'your_database_id')` in the editor's function runner.

- Option B: Set Script Properties manually.

  1. In Apps Script, go to Project Settings (the gear icon) -> "Script properties".
  2. Add properties: `NOTION_API_KEY` and `NOTION_DATABASE_ID` with their values.

If credentials are missing, `addDailyTasks()` will throw a clear error telling you to set them.

## Schedule the trigger (daily at midnight)

1. In the Apps Script editor, open the Triggers page (left sidebar > Triggers).
2. Add a trigger:
   - Choose function: `addDailyTasks`
   - Deployment: Head
   - Event source: Time-driven
   - Type of time based trigger: Day timer
   - Select time: Midnight to 1am (or your preferred time)

## Testing

1. After setting credentials, run `addDailyTasks()` manually from the editor to test.
2. Check the Executions / Logs for errors and verify new pages in your Notion database.

## Customizing daily tasks

Open `コード.js` and edit the `todo` array inside `addDailyTasks()` to change the tasks and genres that will be added.

## Troubleshooting

- If you see permission errors, make sure the Notion integration is invited to the database.
- If the script throws "Missing Notion configuration", set the properties using `setNotionConfig(...)` or the Script Properties UI.

## Contributing

Contributions are welcome. Open a pull request with changes and tests where appropriate.
