import { writable } from 'svelte/store'

const model = {
		// copy from other stores
		charge_current: undefined,
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
		logidx_min: 0,
		logidx_max: 0,
		divert_update: 0,
		vehicle_update: 0,
		rfidscan_update: 0,
		// (todo) derived from other stores
		mode: undefined, // 0:Auto 1:On 2:Off
		charging: false,
		stateclaimfrom: null, // "manual", "timer", "divert", "shaper", "ocpp", "mqtt", "rfid"
		time_localestring: null,
		time_isostring: null,
		divert_type: null,
		// local states
		data_loaded: false,
		ws_connected: undefined,
		http_error: false,
		status_expanded: false,
		window_width: window.innerWidth,
		breakpoint: undefined,
		has_fetched: false,
		wizard_step: 0,
		box_is_scrollable: false,
		box_resize: false
}

function createUIStatesStore() {
    const P  = writable(model)
    const { subscribe, set, update } = P

	
    return {
        subscribe,
        set,
        update
    }
}

export const uistates_store = createUIStatesStore()
