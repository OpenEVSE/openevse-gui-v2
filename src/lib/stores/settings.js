import { writable } from 'svelte-local-storage-store'

export const settings_store = writable('settings', {
	host: "openevse.local",
	auto_release: true,
	lang: "en"
  })