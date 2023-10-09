import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import EndlessHistory from "./features/history/EndlessHistory.tsx";
import "./index.css";
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./features/ErrorPage.tsx";
import { store } from "./app/store";
import { Provider as ReduxProvider } from "react-redux";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/endless-history",
    element: <EndlessHistory />,
    errorElement: <ErrorPage />,
  },
]);

const colors = {
  brand: {
    100: "#186F65",
    200: "#B5CB99",
    300: "#FCE09B",
    400: "#B2533E",
  },
};

const components = {
  Tooltip: defineStyleConfig({ baseStyle: { zIndex: 2 } }),
};

const styles = {
  global: {
    "html, body": {
      color: "gray.100",
    },
  },
};

const theme = extendTheme({ colors, components, styles });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </ChakraProvider>
  </React.StrictMode>
);
