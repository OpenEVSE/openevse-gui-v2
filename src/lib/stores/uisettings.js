import { writable } from 'svelte-local-storage-store'

export const uisettings_store = writable('settings', {
	auto_release: true,
	lang: undefined
  })