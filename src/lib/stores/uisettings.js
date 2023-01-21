import { writable } from 'svelte-local-storage-store'

export const uisettings_store = writable('settings', {
	lang: "en",
	auto_release: true,
	term_fontbig: false,
	tz : undefined,
  })