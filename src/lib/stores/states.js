import { writable } from 'svelte/store'

const model = {
		data_loaded: false,
		max_current: 6,
		mode: 0, // 0:Auto 1:On 2:Off
		autorelease: true,
}
export const states_store = writable(model)