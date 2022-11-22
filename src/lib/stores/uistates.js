import { writable } from 'svelte/store'

const model = {
		// copy from other stores
		max_current: undefined,
		manual_override: undefined,
		shaper: undefined,
		divertmode: undefined,
		
		autorelease: true,
		time_lmt: 0,
		charge_lmt: 0,
		config_version: 0,
		claims_version: 0,
		override_version: 0,
		schedule_version: 0,
		schedule_plan_version: 0,
		// (todo) derived from other stores
		mode: undefined, // 0:Auto 1:On 2:Off
		charging: false,
		stateclaimfrom: null, // "manual", "timer", "divert", "shaper", "ocpp", "mqtt", "rfid"
		time_localestring: null,
		time_isostring: null,
		// local states
		data_loaded: false,
		status_expanded: false,
		window_width: window.innerWidth,
		breakpoint: undefined
}
export const uistates_store = writable(model)
