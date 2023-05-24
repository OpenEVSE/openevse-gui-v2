<script>
	import { derived} 				    from "svelte/store"
	import { limit_store } 				from "./../../lib/stores/limit.js";
	import { uisettings_store } 		from "./../../lib/stores/uisettings.js";
	import {EvseClients} 				from  "./../../lib/vars.js"
	import { uistates_store }			from "./../../lib/stores/uistates.js"
	import { status_store }				from "./../../lib/stores/status.js"
	import { schedule_store } 			from "./../../lib/stores/schedule.js"
	import { plan_store } 				from "./../../lib/stores/plan.js"
	import { config_store } 			from "./../../lib/stores/config.js"
	import { claims_target_store } 		from "./../../lib/stores/claims_target.js"
	import { override_store } 			from "./../../lib/stores/override.js"
	import { clientid2name, 
			formatDate }				from "./../../lib/utils.js"
	import { serialQueue } 				from "./../../lib/queue.js";
	import {onMount} 					from "svelte"
	import { locale }					from 'svelte-i18n'
	import {location} 		 			from 'svelte-spa-router'
	import { _ } 		   	 			from 'svelte-i18n'
	import { keyed } 					from 'svelte-keyed'
	import "hacktimer/HackTimer.js"

	// setTimeout instances
	let counter_divert_update
	let counter_vehicle_update
	let counter_rfid_scan
	let counter_elapsed

	// set keyed derived stores ( note: keyed stores do not trigger an update if the same value is published )
	const time = keyed(status_store, 'time')
	const config_version = keyed(status_store, 'config_version')
	const schedule_version = keyed(status_store, 'schedule_version')
	const schedule_plan_version = keyed(status_store, 'schedule_plan_version')
	const claims_version = keyed(status_store, 'claims_version')
	const override_version = keyed(status_store, 'override_version')
	const limit_version = keyed(status_store, 'limit_version')
	const state = keyed(status_store, 'state')
	const charging = derived(state, $state => $state==3?true:false)
	// const divert_update = keyed(status_store, 'divert_update')
	// const vehicle_state_update = keyed(status_store, 'vehicle_state_update')
	const rfid_waiting = keyed(status_store, 'rfid_waiting')
	const elapsed = keyed(status_store, 'session_elapsed')
	const ipaddress = keyed(status_store, 'ipaddress')
	
	let refresh_config = false
	let refresh_schedule = false
	let refresh_target = false
	let refresh_override = false
	let refresh_plan = false
	let refresh_limit = false
	let prev_ip
	let ip_changed = false

	onMount(()=> {
		getMode($claims_target_store.properties.state,$claims_target_store.claims.state)
	})

	export function refreshDateTime(t,tz) { // params: time (isostring) , timezone
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

	export async function refreshLimitStore(version) {
		if (refresh_limit)
			return
		if ($uistates_store.limit_version != version) {
			if ($status_store.limit) {
				refresh_limit = true
				const res = await serialQueue.add(limit_store.download)
				refresh_limit = false
				if (res) {
					$uistates_store.limit_version = version
					return res
				}
					
				else {
					return false
				} 
			}
			else {
				limit_store.reset()
				$uistates_store.limit_version = version
			}
		}
		else return true
		
	}

	export function refreshChargingState(val) {
		$uistates_store.charging = val
	}


	function getMode(state,clientid) {
		$uistates_store.stateclaimfrom = clientid2name(clientid)
		if (clientid == EvseClients["manual"].id ) {
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

	function countDivertUpdate(val) {
		$uistates_store.divert_update = val
		clearInterval(counter_divert_update)
		counter_divert_update = setInterval(() => {
			$uistates_store.divert_update++
		}, 1000);

	}

	function countVehicleUpdate(val) {
		$uistates_store.vehicle_state_update = val
		clearInterval(counter_vehicle_update)
		counter_vehicle_update = setInterval(() => {
			$uistates_store.vehicle_state_update ++
		}, 1000);
	}

	function countRFIDScan(val) {
		$uistates_store.rfid_waiting = val
		clearInterval(counter_rfid_scan)
		counter_rfid_scan = setInterval(() => {
			$uistates_store.rfid_waiting--
			if ($uistates_store.rfid_waiting==0) {
				clearInterval(counter_rfid_scan)
			}
		}, 1000);
	}
	
	function countElapsed(val,charging) {
		$uistates_store.elapsed = val
		clearInterval(counter_elapsed)
		if (charging) {
			counter_elapsed = setInterval(() => {
				$uistates_store.elapsed++
			}, 1000);
		}
	}

	function refreshLocale(lang) {
		if ($locale != $config_store.lang) {
			$locale = lang
			let setting = {lang: $locale}
			uisettings_store.set({...$uisettings_store, ...setting}) 
		}
	}


	async function redirect2ip(ip) {
		if (ip != prev_ip) {
			if (ip && ip != "192.168.4.1" && prev_ip) {
				uistates_store.resetAlertBox()
				$uistates_store.alertbox.visible = true
				$uistates_store.alertbox.title = $_("notification")
				$uistates_store.alertbox.body = $_("config.network.con-ok") + ip 
				$uistates_store.alertbox.button = true
				$uistates_store.alertbox.closable = false
				$uistates_store.alertbox.action = () => {window.location.href = "http://" + ip + "/#" + $location}
			}
			prev_ip = ip
			ip_changed = true
		}
	}

	function setErrorState(state) {
		if (state >= 4 && state <= 11) {
			// error state
			$uistates_store.error = true
		}
		else $uistates_store.error = false
	}


	// Refresh stores when new version is published over websocket
	$: refreshConfigStore		($config_version)
	$: refreshSchedulestore		($schedule_version)
	$: refreshPlanStore			($schedule_plan_version)
	$: refreshClaimsTargetStore	($claims_version)
	$: refreshOverrideStore     ($override_version)
	$: refreshLimitStore		($limit_version)

	$: refreshDateTime			($time, $config_store?.time_zone)
	$: refreshChargingState		($charging)
	$: refreshLocale			($config_store.lang)

	$: countDivertUpdate($status_store.divert_update)
	$: countVehicleUpdate($status_store.vehicle_state_update)
	$: countRFIDScan($rfid_waiting)
	$: countElapsed($elapsed,$charging)

	$: redirect2ip($ipaddress)
	$: setErrorState($state)


</script>
