# Damage Index App

## Description

The goal of this app is to show the user optimized drilling conditions based on the proprietary damage index from Trinity. By assisting the driller and keeping the parameters within the targeted range this will extend the life of the motor.

## Type

**Front-end app**

## Inputs

1. _**Props:**_
   ```
   {
     appHeaderProps: Object, // props passed to AppHeader component from "@corva/ui" lib
     currentUser: { company_id: number },
     well: { asset_id: number, id: string, name: string }
   }
   ```
2. _**Data from API:**_

   - data with damage index form `digs_di` dataset
   - recommended parameters from `parameter-optimization-v0` dataset
   - list of wells for current company

3. _**User actions:**_
   - selecting offset wells
   - selecting X axis and Y axis for line graph
   - switching between "chart" and "table" view for block "Recommended Parameters"

## Outputs

- current damage index
- damage index changing over time and depth
- matching between current parameters and recommended parameters
- parameters comparison between current well and offset wells

## Related apps & services

**_UI components_**

- @corva/ui/components
- @material-ui
- highcharts

**_API_**

- @corva/ui/clients (corvaAPI and corvaDataAPI)

## Development and test instructions

### Environment

1. You should have an account at Corva.
2. Follow 1st steps instructions -
   [Corva documentaion](https://dc-docs.corva.ai/docs/Frontend/Getting%20Started).

### Debug

#### `yarn start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000/) to view it in the browser.
The page will reload if you make edits. You will also see any lint errors in the console.

### Tests

#### `yarn test`

Runs unit tests.

### Code style & commit naming conventions

- [Code Style](https://www.notion.so/corva/Front-End-Code-style-d9b6a5b835fa48478e69e1922098ad47)
- [Tests Guide](https://www.notion.so/corva/Tests-guide-520058fa52454e5aa08ef9225d7d76e9)
- [Contributing Guide](https://www.notion.so/corva/CONTRIBUTING-Guidelines-28bcd1527a9b4a579a71dd8d1d045f25)
- [PR Rules](https://www.notion.so/corva/Pull-Requests-rules-a21cffaa6d15482e8e89178b40c83789)
- [Common Design Requirements](https://www.notion.so/corva/Common-design-dev-requirements-6789168a94f847da96be0157af992ab1)

Also, you can use the following tools to improve the quality of the code.

1. **Linter** command `yarn lint`.
2. [**SonarLint** extension for yor code editor](https://www.sonarsource.com/products/sonarlint/).
3. [**jscpd** - lib to detect code duplications](https://github.com/kucherenko/jscpd)

## Deployment

Follow this instruction to publish the app to Dev Center - [Publish documentation](https://dc-docs.corva.ai/docs/Frontend/Tutorials/Upload%20and%20Publish). <br>

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
