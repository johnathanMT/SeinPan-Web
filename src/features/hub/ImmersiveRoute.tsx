import ImmersivePage from "./pages/ImmersivePage";
import { registerHubLocales } from "./registerHubLocales";

registerHubLocales();

/** Legacy full-screen layout (/immersive). */
export default function ImmersiveRoute() {
  return <ImmersivePage />;
}
