import { writable } from 'svelte/store'

const model = {
		data_loaded: false,
		max_current: undefined,
		mode: undefined, // 0:Auto 1:On 2:Off
		autorelease: true
}
export const uistates_store = writable(model)
