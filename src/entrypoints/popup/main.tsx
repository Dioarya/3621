import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@/hooks/useTheme";

import "./style.css";
import "@/assets/tailwind.css";
import App from "./App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const app = (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
const strictWrap = import.meta.env.PROD ? app : <React.StrictMode>{app}</React.StrictMode>;

root.render(strictWrap);
