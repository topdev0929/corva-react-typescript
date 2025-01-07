# Getting Started with Treatment Plot App

### Language

JavaScript

## Development process

The repository follows [Corva development guideline](https://www.notion.so/corva/Dev-Center-apps-development-a3ad896324f64c53904e3c39703d81bc). Please read it.

Jump to [the section that describes usual feat/fix development](https://www.notion.so/corva/Dev-Center-apps-development-a3ad896324f64c53904e3c39703d81bc#0d3ca6a7b26c4c55a6afcb82cb22a613) to read about the usual development flow

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.

> **Before run:** Setup `.env` file by the `.env.sample` example, using your environment API token (most likely the QA)
Open [http://app.local.corva.ai:8080](http://app.local.corva.ai:8080/) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Bundles the app into static files for production.

### `yarn zip`

Bundles the app into ZIP file in app root directory

### `yarn release`

Deploys app version to defined environment

## Documentation

- [Dev Center documentation](https://dc-docs.corva.ai/) – information about development process
- [Component Library](https://dc-docs.corva.ai/docs/Frontend/Data%20visualization/Components%20library)
- [Datasets documentation](https://dc-docs.corva.ai/docs/Datasets/Link%20App%20to%20Dataset)
- [App Design](https://www.figma.com/file/XtOZKZvms4Ws1B9Fh6jRMx/Treatment-Plot)

## App Details

- The Treatment Plot App uses [Echarts](https://echarts.apache.org/en/) library for charts drawing.
- The point of the app is showing fracing data channels by stages or selected time period
- A user can select channels to display and stage mode to select time span (or stages)

## Used API

- Wits: **/v1/data/corva/completion.wits** - used for displaying data in 2 hours zoom time span and less
- Wits 10 seconds summary: **/v1/data/corva/completion.wits.summary-10s** - used for displaying single stage, and data in 12 hours zoom time span and less
- Wits 1 minute summary: **/v1/data/corva/completion.wits.summary-1m** - used for displaying multiple stages data
- Predictions - **/v1/data/corva/completion.predictions** - used for getting stage events for chart
- Activities - **/v1/data/corva/completion.activity.summary-stages** - used to fetch stage(s) activity data for activity chart
- Stage Times - **/v1/data/corva/completion.stage-times** - used to determine time limits of assets' stages for last N hours in stage mode and for CSV editor
- App streams - **/v1/app_streams** - used to get asset's channels
