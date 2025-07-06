import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/variable.css";
import "./index.css";
import "./styles/global.css";
import App from "./App/App";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element not found");
}
