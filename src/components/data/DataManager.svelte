<script>
	import { uisettings_store } from "./../../lib/stores/uisettings.js";
	import "hacktimer/HackTimer.js"
	import {EvseClients} 				from  "./../../lib/vars.js"
	import { uistates_store }			from "./../../lib/stores/uistates.js"
	import { status_store }				from "./../../lib/stores/status.js"
	import { schedule_store } 			from "./../../lib/stores/schedule.js"
	import { plan_store } 				from "./../../lib/stores/plan.js"
	import { config_store } 			from "./../../lib/stores/config.js"
	import { claims_target_store } 		from "./../../lib/stores/claims_target.js"
	import { override_store } 			from "./../../lib/stores/override.js"
	import { clientid2name, formatDate} from "./../../lib/utils.js"
	import { serialQueue } 				from "./../../lib/queue.js";
	import {onMount} 					from "svelte"
	import { locale }					from 'svelte-i18n'

	let counter_divert_update
	let counter_vehicle_update
	let counter_rfid_scan
	let refresh_config = false
	let refresh_schedule = false
	let refresh_target = false
	let refresh_override = false
	let refresh_plan = false

	onMount(()=> {
		getMode($claims_target_store.properties.state,$claims_target_store.claims.state)
	})

	export function refreshDateTime(t,tz) { // params: time (isostring) , timezone
		$uistates_store.time_isostring = t
		$uistates_store.time_localestring = formatDate(t,tz)
	}
	export async function refreshConfigStore(ver) {
		if (refresh_config)
			return
		if (ver != $uistates_store.config_version) {
			refresh_config = true
			const res = await serialQueue.add(config_store.download)
			if (res)
				$uistates_store.config_version=ver
			refresh_config = false
			return res
		}
	}

	export async function refreshSchedulestore(ver) {
		if (refresh_schedule)
			return
		if (ver != $uistates_store.schedule_version) {
			refresh_schedule = true
			$uistates_store.schedule_version=ver
			const res = await serialQueue.add(schedule_store.download)
			refresh_schedule = false
			return res
		}
	}

	export async function refreshPlanStore(ver) {
		if (refresh_plan)
			return
		if (ver != $uistates_store.schedule_plan_version) {
			refresh_plan = true
			$uistates_store.schedule_plan_version=ver
			const res = await serialQueue.add(plan_store.download)
			refresh_plan = false
			return res
		}
	}

	export async function refreshClaimsTargetStore(ver) {
		if (refresh_target)
			return
		if (ver != $uistates_store.claims_version) {
			refresh_target = true
			$uistates_store.claims_version = ver
			const res = await serialQueue.add(claims_target_store.download)
			if (res) {		
				getMode($claims_target_store.properties.state,$claims_target_store.claims.state)
			}
			refresh_target = false
			return res
		}
		return false
	}

	export async function refreshOverrideStore(version) {
		if (refresh_override)
			return
		if ($uistates_store.override_version != version) {
			refresh_override = true
			$uistates_store.override_version = version
			const res = await serialQueue.add(override_store.download)
			refresh_override = false
			if (res) 
				return res
			else return false
		}
		else return true
	}


	export async function refreshStatusStore() {
		const res = await serialQueue.add(status_store.download)
		return res
	}

	export function refreshUIState(store) {
		$uistates_store.charging = store.state == 3
	}


	function getMode(state,clientid) {
		$uistates_store.stateclaimfrom = clientid2name(clientid)
		if (clientid == EvseClients["manual"].id || clientid == undefined) {
			// Mode Manual		
			switch (state) {
				case "active":
					$uistates_store.mode = 1 // On
					break
				case "disabled":
					$uistates_store.mode = 2 // Off
					break;
				default: 
					break
			}
		}
		else {
			// mode Auto
			$uistates_store.mode = 0
		}
	}

	function countDivertUpdate() { 
		if(!counter_divert_update) {
			counter_divert_update = setTimeout(() => {
				$status_store.divert_update += 1
				counter_divert_update = null
			}, 1000);
		}

	}

	function countVehicleUpdate() {
		if (!counter_vehicle_update) {
			counter_vehicle_update = setTimeout(() => {
				$status_store.vehicle_state_update += 1
				counter_vehicle_update = null
		}, 1000);
		}

	}
	
	function countRFIDScan() {
		if (!counter_rfid_scan) {
			if ($status_store.rfid_waiting > 0) {
				counter_rfid_scan = setTimeout(() => {
					$status_store.rfid_waiting -= 1
					counter_rfid_scan = null
				}, 1000);
			}
		}
	}

	function refreshLocale(lang) {
		if ($locale != $config_store.lang) {
			$locale = lang
			let setting = {lang: $locale}
			uisettings_store.set({...$uisettings_store, ...setting}) 
		}
	}

	function getDivertMode(grid = "") {
		if (grid) {
			$uistates_store.divert_type = 1
		}
		else {
			$uistates_store.divert_type = 0
		}
	}



	// Refresh stores when new version is published over websocket
	$: refreshConfigStore		($status_store.config_version)
	$: refreshSchedulestore		($status_store.schedule_version)
	$: refreshPlanStore			($status_store.schedule_plan_version)
	$: refreshClaimsTargetStore	($status_store.claims_version)
	$: refreshOverrideStore     ($status_store.override_version)
	$: refreshDateTime			($status_store.time, $config_store?.time_zone)
	$: refreshUIState			($status_store)
	$: refreshLocale			($config_store.lang)
	$: getDivertMode			($config_store.mqtt_grid_ie)
	$: $status_store.divert_update,        countDivertUpdate()
	$: $status_store.vehicle_state_update, countVehicleUpdate()
	$: $status_store.rfid_waitin, 		   countRFIDScan()
	

</script>
