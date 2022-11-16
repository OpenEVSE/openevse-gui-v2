<script>
	
	import WebSocket from "./WebSocket.svelte";
	import {EvseClients} 			from  "./../../lib/vars.js"
	import { uistates_store }		from "./../../lib/stores/uistates.js"
	import { status_store }			from "./../../lib/stores/status.js"
	import { schedule_store } 		from "./../../lib/stores/schedule.js"
	import { plan_store } 			from "./../../lib/stores/plan.js"
	import { config_store } 		from "./../../lib/stores/config.js"
	import { claims_target_store } 	from "./../../lib/stores/claims_target.js"
	import { override_store } 		from "./../../lib/stores/override.js"
	import { clientid2name, formatDate} from "./../../lib/utils.js"
	import { serialQueue } from "./../../lib/queue.js";

	// onMount(()=>fetchQueue.start())

	export function refreshDateTime(t,tz) { // params: time (isostring) , timezone
		$uistates_store.time_isostring = t
		$uistates_store.time_localestring = formatDate(t,tz)
	}
	export async function refreshConfigStore(ver) {
		if (ver != $uistates_store.config_version) {
			console.log("refreshConfigStore")
			const res = await serialQueue.add(config_store.download)
			if (res) $uistates_store.config_version=ver
			return res
		}
	}

	export async function refreshSchedulestore(ver) {
		if (ver != $uistates_store.schedule_version) {
			console.log("add refreshSchedulestore")
			const res = await serialQueue.add(schedule_store.download)
			if (res) $uistates_store.schedule_version=ver
			return res
		}
	}

	export async function refreshPlanStore(ver) {
		if (ver != $uistates_store.schedule_plan_version) {
			console.log("add refreshPlanstore")
			const res = await serialQueue.add(plan_store.download)
			if (res) $uistates_store.schedule_plan_version=ver
			return res
		}
	}

	export async function refreshClaimsTargetStore(ver) {
		if (ver != $uistates_store.claims_version) {
			console.log("add refreshClaimsTargetStore")
			const res = await serialQueue.add(claims_target_store.download)
			if (res)
				$uistates_store.claims_version=ver
			if ($status_store.manual_override) {
				console.log("add refreshOverrideStore")
				let res
				if($status_store.manual_override)
					res = await serialQueue.add(override_store.download)
				return res
			}
			return res
		}
	}

	export async function refreshStatusStore() {
		console.log("add refreshStatusStore")
		const res = await serialQueue.add(status_store.download)
		return res
	}


	function getMode(state,clientid) {
		$uistates_store.stateclaimfrom = clientid2name(clientid)
		if (clientid == EvseClients["manual"] || clientid == undefined) {
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



	// Refresh stores when new version is published over websocket
	$: refreshConfigStore		($status_store.config_version)
	$: refreshSchedulestore		($status_store.schedule_version)
	$: refreshPlanStore			($status_store.schedule_plan_version)
	$: refreshClaimsTargetStore	($status_store.claims_version)
	$: refreshDateTime			($status_store.time, $config_store.time_zone)
	$: getMode					($claims_target_store.properties.state,$claims_target_store.claims.state)

</script>

<WebSocket />