# Operation Insights App

## Description

The app shows critical operational “insights” or events that take place during any number of operation types.
This could be used for production monitoring, piloting new equipment or technologies, or even general drilling and completions.
The goal is to add event context and comments from different user roles to tell a full story of what happened during a given period.
This app along with a data visualization app on the same dashboard gives more depth for the user to understand what is happening on site.

## Type

**Front-end app**

## Inputs

1. _**Props:**_
   ```
   {
     appHeaderProps: Object, // props passed to AppHeader component from "@corva/ui" lib
     currentUser: { company_id: number, first_name: string, last_name: string },
     well: { asset_id: number, id: string, name: string }
   }
   ```
2. _**Data from API:**_

   - events from `data.insights.events` dataset
   - records from `data.insights.files` dataset
   - list of users for showing authors of events

3. _**User actions:**_
   - filter events by type
   - filter events by date range
   - change month in calendar
   - select day in calendar
   - add new event
     - upload file
     - delete file
   - edit event
   - delete event
   - download file
   - show file content
   - add comment to event

## Outputs

- list of events in calendar
- list of events (with details) for selected day
- attached files of events
- list of comments for event

## Related apps & services

**_UI components_**

- @corva/ui/components
- @material-ui

**_API_**

- @corva/ui/clients
  - corvaDataAPI
  - corvaAPI
- S3 (storing files)

## Development and test instructions

### Environment

**This app requires the QA environment, so the following steps describe instructions for QA env.**

1. You should have an account at Corva.
2. Follow 1st steps instructions -
   [Corva documentaion](https://dc-docs.corva.ai/docs/Frontend/Getting%20Started).
3. Add the `env.` file to the root directory with the following lines to use QA API.
   ```
   HOST=localhost
   PORT=3000
   CORVA_API_ENV=qa
   ```

### Debug

#### `yarn start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000/) to view it in the browser.
The page will reload if you make edits. You will also see any lint errors in the console.

### Tests

#### Run tests:

#### `yarn test`

#### Check code coverage:

#### `yarn test:coverage`

### Code style & commit naming conventions

#### Check code style:

#### `yarn lint`

#### Fix code style:

#### `yarn lint:fix`

#### Helpful links:

- [Code Style](https://www.notion.so/corva/Front-End-Code-style-d9b6a5b835fa48478e69e1922098ad47)
- [Tests Guide](https://www.notion.so/corva/Tests-guide-520058fa52454e5aa08ef9225d7d76e9)
- [Contributing Guide](https://www.notion.so/corva/CONTRIBUTING-Guidelines-28bcd1527a9b4a579a71dd8d1d045f25)
- [PR Rules](https://www.notion.so/corva/Pull-Requests-rules-a21cffaa6d15482e8e89178b40c83789)
- [Common Design Requirements](https://www.notion.so/corva/Common-design-dev-requirements-6789168a94f847da96be0157af992ab1)

**Also, you can use the following tools to improve the quality of the code.**

1. [**SonarLint** extension for yor code editor](https://www.sonarsource.com/products/sonarlint/).
2. [**jscpd** - lib to detect code duplications](https://github.com/kucherenko/jscpd)

## Deployment

This app contain GitHub Actions workflow to deploy it to Dev Center. You can read more about automated deploy [here](https://www.notion.so/corva/Dev-Center-apps-development-a3ad896324f64c53904e3c39703d81bc) <br>
If you want manually deploy this app follow this instruction to publish the app to Dev Center - [Publish documentation](https://dc-docs.corva.ai/docs/Frontend/Tutorials/Upload%20and%20Publish). <br>

## Ownership

**Owner** - Vlad Kolotusha <br>
**Responsible for merge** - Vlad Kolotusha <br>

## Links

- [Design](https://www.figma.com/file/MaZr55Cf2zVDDaEq39pPEE/Damage-Index-App---Trinity?node-id=58%3A7709&t=iCCztwRueLUIoIFQ-1)
- [App Docs](https://docs.google.com/document/d/1xVKNQSusSbeTSWj4g5FC8vaXzYoYKNG-L8TnCdebn-0/edit)
- [Dev Center documentation](https://dc-docs.corva.ai/docs/Frontend/Intro) – information about development process
- [Component Library](https://storybook.dev.corva.ai/)
- [Datasets documentation](https://dc-docs.corva.ai/docs/Datasets/Link%20App%20to%20Dataset)
- [API documentation](https://dc-docs.corva.ai/docs/API/API%20Requests)
- [API Swagger](https://api.corva.ai/documentation/index.html)
- [Data API Swagger](https://data.corva.ai/docs#/data)
