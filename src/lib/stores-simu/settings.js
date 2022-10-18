import { writable } from 'svelte-local-storage-store'

export const settings_store = writable('settings', {
	auto_release: true,
	lang: "en"
  })