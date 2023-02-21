import { writable, derived, get } from 'svelte/store'

const model = {
		// copy from other stores
		charge_current: undefined,
		manual_override: undefined,
		shaper: undefined,
		autorelease: true,
		time_lmt: 0,
		charge_lmt: 0,
		config_version: 0,
		claims_version: 0,
		override_version: 0,
		schedule_version: 0,
		schedule_plan_version: 0,
		limit_version: 0,
		logidx_min: 0,
		logidx_max: 0,
		// (todo) derived from other stores
		mode: undefined, // 0:Auto 1:On 2:Off
		charging: false,
		stateclaimfrom: null, // "manual", "timer", "divert", "shaper", "ocpp", "mqtt", "rfid"
		time_localestring: null,
		divert_type: 0,
		power: 0,
		// local states
		data_loaded: false,
		ws_connected: true,
		status_expanded: false,
		breakpoint: undefined,
		has_fetched: false,
		wizard_step: 0,
		alertbox: {
			title: undefined,
			body: undefined,
			visible: false,
			button: false,
			closable: true,
			action: ()=>{},
		}
}

function createUIStatesStore() {
    const P  = writable(model)
    const { subscribe, set, update } = P

	function resetAlertBox() {
		let states = get(P)
		states.alertbox = {
			title: undefined,
			body: undefined,
			visible: false,
			button: false,
			closable: true,
			action: ()=>{},
		}
		P.update(() => states)
	}
	
    return {
        subscribe,
        set,
		resetAlertBox,
        update
    }
}

export const uistates_store = createUIStatesStore()


