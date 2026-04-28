import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style.css";
import "@/assets/tailwind.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const app = (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
const strictWrap = import.meta.env.PROD ? app : <React.StrictMode>{app}</React.StrictMode>;

root.render(strictWrap);
