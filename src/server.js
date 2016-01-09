import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import serialize from 'serialize-javascript';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createElementWithContext } from 'fluxible-addons-react';
import { navigateAction } from 'fluxible-router';
import app from './app';
import Document from './components/Document';

const server = createServer();
const port = process.env.PORT || 5000;

function createServer() {
  let server = express();

  prepareServer(server);

  return server;
}

function prepareServer(server) {
  // set up request parser
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.use(cookieParser());

  // set up static routes
  server.use('/css', express.static(path.join(__dirname, 'css')));
  server.use('/js', express.static(path.join(__dirname, 'js')));

  // set up dynamic routes
  server.use((request, response, next) => {
    const context = app.createContext();

    context.getActionContext().executeAction(navigateAction, {
      url : request.url
    }, error => {
      if (error) {
        return next(error);
      }
      const exposeState = `window.__CONTEXT__=${serialize(app.dehydrate(context))};`;
      const markup = ReactDOMServer.renderToString(createElementWithContext(context));
      const documentElement = React.createElement(Document, {
        state   : exposeState,
        context : context.getComponentContext(),
        markup  : markup
      });
      const html = ReactDOMServer.renderToStaticMarkup(documentElement);

      response.send(html);
    });
  });
}

server.listen(port);
console.info(`listening on ${port}...`);
