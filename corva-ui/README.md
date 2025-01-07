# @corva/ui
<a href="https://storybook.dev.corva.ai/" target="_blank"><img src="https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg"></a>
[![npm version](https://img.shields.io/npm/v/@corva/ui/latest?color=green&label=%40latest&style=flat-square)](https://www.npmjs.com/package/@corva/ui)
[![npm version](https://img.shields.io/npm/v/@corva/ui/next?color=yellow&label=%40next&style=flat-square)](https://www.npmjs.com/package/@corva/ui)
[![npm version](https://img.shields.io/npm/v/@corva/ui/dev?color=orange&label=%40dev&style=flat-square)](https://www.npmjs.com/package/@corva/ui)


develop: [![CircleCI](https://dl.circleci.com/status-badge/img/gh/corva-ai/corva-ui/tree/develop.svg?style=shield&circle-token=ccf733c7ccd04efb3b7a8ffef707620be0ee127e)](https://dl.circleci.com/status-badge/redirect/gh/corva-ai/corva-ui/tree/develop)
main: [![CircleCI](https://dl.circleci.com/status-badge/img/gh/corva-ai/corva-ui/tree/main.svg?style=shield&circle-token=ccf733c7ccd04efb3b7a8ffef707620be0ee127e)](https://dl.circleci.com/status-badge/redirect/gh/corva-ai/corva-ui/tree/main)


This repo contains components/utils which are shared for Corva ui apps.

### When you need some library changes
Currently @corva/ui library is owned by the Dev Center team, but is developed by every Corva FE developer. So, if you need to make some update in it - you can do it by yourself. For small updates - just make a PR - and someone from the Dev Center team will review it. 

If it's something pretty big - it's better to reach out someone from the Dev Center team first, to tell what you need and get feedback how to better do it. Otherwise - you risk that your huge PR on which you worked a week can be rejected because it can be not consistent with the rest of the lib

### Release & deploy of the library
How to bump the version? What should be the branch name? And other more advanced cases, like release/hotfixes. The guideline for all of these cases can be found [here (Corva access required)](https://www.notion.so/corva/corva-ui-d510f545ffb74c9bafd6b1bfbc0b99bf)


### Stories for every public component
Every public @corva/ui component has a corresponding `.stories.js` file that describes the component. When you work with public @corva/ui
components - please also update it's `stories.js` file when it's necessary 

## Local development


- `yarn storybook` will launch local storybook server which is convenient to use for components testing when you work on public components. That's a playground for building public components.
- `yarn start` will open ExampleApp.js in your browser. That's a playground for building non-public components (such components will be moved from @corva/ui soon)

## Link local `@corva/ui` to your app

### Pre-requisite

* Make sure you are using `@corva/ui` with latest updates from `development` branch

* If your app is using `getWebpackConfig` from `@corva/ui` instead of `@corva/dc-platform-shared`, migrate it according to [this guide](https://www.notion.so/corva/Migration-to-corva-dc-platform-shared-721cc822e23c4c43a7630b73fdeec3d9)

### Steps to link your local DC app**

1. Run `yarn build-dev` or `yarn build-watch` in @corva/ui repo
    <br/>***Note:** `yarn build` will not work for linking*

2. `cd ./dist` and run `yarn link` in @corva/ui dist folder (only first time)

3. Run `yarn link @corva/ui` in your local DC app root folder

4. Add following parameters to the `config-overrides.js`.<br/>It should avoid the issue of mulitple React instances and the MUI styling issue
```
{
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            '@material-ui': resolve('./node_modules/@material-ui'),
        }
    }
}
```


5. Run `yarn start` in your local DC app root folder

***Note:** npm link will not install @corva/ui dependencies in your node modules folder.*
If you want to debug a change  in @corva/ui dependencies, you should use `yarn add file:../corva-ui/dist`, this will install new dependencies.

### Troubleshooting

#### Failed to compile.<br />`Module not found: Can't resolve '@corva/ui' in ...`
Most likely you need to [migrate to `@corva/dc-platform-shared`](https://www.notion.so/corva/Migration-to-corva-dc-platform-shared-721cc822e23c4c43a7630b73fdeec3d9) for cjs webpack config usage

#### Error.<br/>`Invalid hook call. Hooks can only be called inside of the body of a function component...`

 In that case, your bundler might “see” two Reacts — one in application folder and one in your library folder. Assuming myapp and mylib are sibling folders, one possible fix is to run npm link ../myapp/node_modules/react from mylib. This should make the library use the application’s React copy.


 Or change the webpack configuration in `config-overrides.js` file in your app. (Don't commit the changes of this file)
```
{
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react')
        }
    }
}
```

#### Material UI styles are corrupted
Add the following parameter to the `config-overrides.js` file in your app
```
{
    resolve: {
        alias: {
            '@material-ui': resolve('./node_modules/@material-ui')
        }
    }
}
```
