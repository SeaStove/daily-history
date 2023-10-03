import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage.tsx";

const router = createHashRouter([
  {
    path: "/*",
    element: <App />,
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

const theme = extendTheme({ colors, components });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
