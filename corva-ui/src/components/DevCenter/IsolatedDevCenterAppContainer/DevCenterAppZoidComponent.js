import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import * as zoid from '@krakenjs/zoid/dist/zoid.frameworks';
import { ServerStyleSheets } from '@material-ui/core/styles';

import { AppHeader } from '~/components';
import Loader from '~/components/LoadingIndicator/Loader';

export const APP_IFRAME_ATTRIBUTE = 'data-corva-app-iframe';

const devCenterAppZoidInstance = zoid.create({
  tag: 'dc-isolated-app-zoid-component',
  url: new URL('DevCenterIsolatedAppPage.html', window.location.origin).href,
  dimensions: {
    width: '100%',
    height: '100%',
  },
  prerenderTemplate: function containerTemplate({ doc, props }) {
    const sheets = new ServerStyleSheets();

    const loaderString = ReactDOMServer.renderToStaticMarkup(
      sheets.collect(
        <div style={{ padding: 12, color: 'white', fontFamily: 'Roboto, sans-serif' }}>
          <AppHeader app={props.app} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Loader />
          </div>
        </div>
      )
    );

    const html = doc.createElement('html');
    const head = doc.createElement('head');
    head.innerHTML =
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />';
    const style = doc.createElement('style');
    style.innerHTML = sheets.toString();
    head.appendChild(style);

    const body = doc.createElement('body');
    body.style.margin = 0;
    body.innerHTML = loaderString;

    html.appendChild(head);
    html.appendChild(body);

    return html;
  },
  attributes: {
    iframe: {
      [APP_IFRAME_ATTRIBUTE]: true,
    },
  },
});

export const DevCenterAppZoidComponent = devCenterAppZoidInstance.driver('react', {
  React,
  ReactDOM,
});
