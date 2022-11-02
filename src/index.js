import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Amplify } from "aws-amplify";
import config from "./aws-exports";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Text, Flex, ThemeProvider, Theme } from "@aws-amplify/ui-react";
Amplify.configure(config);

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
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
