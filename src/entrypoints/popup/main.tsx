import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@/hooks/useTheme";

import "./style.css";
import "@/assets/global.css";
import App from "./App.tsx";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const app = (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
const strictWrap = import.meta.env.PROD ? app : <React.StrictMode>{app}</React.StrictMode>;

if (import.meta.env.DEV) console.log("[popup] log: rendering with StrictMode");

root.render(strictWrap);
