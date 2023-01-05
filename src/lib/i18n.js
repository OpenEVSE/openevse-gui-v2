import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { uisettings_store } from './stores/uisettings.js'
import { get } from 'svelte/store'

register("en", () => import("./i18n/en.json"))
register("fr", () => import("./i18n/fr.json"))

let locale = 'en'

let param = {
	fallbackLocale: 'en'
}
if ( get(uisettings_store).lang != undefined ) {
	param.initialLocale = get(uisettings_store).lang
}

init(param);