import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Amplify } from "aws-amplify";
import { DAppProvider, ChainId } from "@usedapp/core";
import config from "./aws-exports";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Text, Flex, ThemeProvider, Theme } from "@aws-amplify/ui-react";
Amplify.configure(config);

const DappConfig = {
  readOnlyChainId: ChainId.Goerli,
  readOnlyUrls: {
    [ChainId.Goerli]:
      "https://goerli.infura.io/v3/61fd3f1e41834c5ebd42c6d193267d74",
  },
};

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "white",
      },
    }),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <DAppProvider config={DappConfig}>
        <App />
      </DAppProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
