import "./app.scss";
import "./mystyles.scss"
import App from "./WifiPortal.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
