import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react"
import {
  BrowserRouter,
} from "react-router-dom";
import Parse from "parse";
import './index.css';
import {Provider} from '@shopify/app-bridge-react';
import { parseQuery } from "./utils/url";
import AppRoutes from "./routes"


Parse.initialize(process.env.REACT_APP_API_SHOPLOOKS_PARSE_APP_ID, process.env.REACT_APP_API_SHOPLOOKS_PARSE_JSKEY);
Parse.serverURL = process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL + '/parse';
Parse.enableLocalDatastore();

const { host } = parseQuery(window.location.search);
if (!host) {
  ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
  
} else {
  ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider>
          <BrowserRouter>
            <Provider config={{ apiKey: 'f8afe3da5a559e7182f340bf08aeec31', host: host,  forceRedirect: true }}>
              <AppRoutes />
            </Provider>
          </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
