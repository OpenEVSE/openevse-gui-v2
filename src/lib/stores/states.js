import { writable } from 'svelte/store'

const model = {
	data: {
		loaded: false
	},
	settings: {
		max_current: 6
	}
}
export const states_store = writable(model)