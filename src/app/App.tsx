import OfficialPage from "../features/official/OfficialPage";

// The site is a single page with hash tabs, so it needs no router: "/" and
// any unknown path (restored by public/404.html + boot.js) show the shop.
export default function App() {
  return <OfficialPage />;
}
