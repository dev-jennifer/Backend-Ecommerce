import { React, ReactDOM } from "./deps.ts";

import App from "./app.tsx";
(ReactDOM as any).hydrate(
  <App />,
  document.getElementById("root")
);


