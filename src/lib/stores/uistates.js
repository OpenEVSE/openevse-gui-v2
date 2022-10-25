import { writable } from 'svelte/store'

const model = {
		data_loaded: false,
		max_current: undefined,
		manual_override: undefined,
		shaper: undefined,
		mode: undefined, // 0:Auto 1:On 2:Off
		autorelease: true,
		window_width: window.innerWidth,
		breakpoint: undefined
}
export const uistates_store = writable(model)
