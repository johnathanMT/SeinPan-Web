import i18n from "../../shared/i18n";
import enCatalog from "../../locales/en/catalog.json";
import enCommon from "../../locales/en/common.json";
import enHome from "../../locales/en/home.json";
import myCatalog from "../../locales/my/catalog.json";
import myCommon from "../../locales/my/common.json";
import myHome from "../../locales/my/home.json";

/**
 * The legacy /hub and /immersive layouts use their own namespaces. They are
 * bundled with this chunk (not the homepage) and registered on first load.
 */
const BUNDLES = {
  en: { common: enCommon, home: enHome, catalog: enCatalog },
  my: { common: myCommon, home: myHome, catalog: myCatalog },
} as const;

let registered = false;

export function registerHubLocales(): void {
  if (registered) return;
  for (const [lng, namespaces] of Object.entries(BUNDLES)) {
    for (const [ns, resources] of Object.entries(namespaces)) {
      i18n.addResourceBundle(lng, ns, resources, true, false);
    }
  }
  registered = true;
}
