import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import DailyHistory from "./features/history/DailyHistory.tsx";
import "./index.css";
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./features/ErrorPage.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/daily-history",
    element: <DailyHistory />,
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
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
