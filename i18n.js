import { register, init } from 'svelte-i18n';
import { uisettings_store } from './stores/uisettings.js'
import { get } from 'svelte/store'

register("en", () => import("./i18n/en.json"))
register("fr", () => import("./i18n/fr.json"))
register("es", () => import("./i18n/es.json"))
register("hu", () => import("./i18n/hu.json"))
register("pl", () => import("./i18n/pl.json"))

let locale = "pl"
if ( get(uisettings_store).lang != undefined ) {
	locale = get(uisettings_store).lang
}

let param = {
	fallbackLocale: 'pl',
	initialLocale: locale
}

init(param);
