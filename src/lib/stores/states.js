import { writable } from 'svelte/store'

const model = {
	data: {
		loaded: false
	},
	states: {
		max_current: 6,
		mode: 0,
	}
}
export const states_store = writable(model)