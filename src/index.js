import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "beautiful-react-diagrams/styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
