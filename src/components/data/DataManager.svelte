<script>
	
	import WebSocket from "./WebSocket.svelte";
	import { onMount } 				from "svelte"
	import {EvseClients} 			from  "./../../lib/vars.js"
	import { uistates_store }		from "./../../lib/stores/uistates.js"
	import { status_store }			from "./../../lib/stores/status.js"
	import { schedule_store } 		from "./../../lib/stores/schedule.js"
	import { plan_store } 			from "./../../lib/stores/plan.js"
	import { config_store } 		from "./../../lib/stores/config.js"
	import { claims_target_store } 	from "./../../lib/stores/claims_target.js"
	// import { claim_store } 			from "./../../lib/stores/claim.js"
	import { override_store } 		from "./../../lib/stores/override.js";
	import { fetchQueue }			from "./../../lib/fetchQueue.js"
	import {clientid2name}			from "./../../lib/utils.js"
	// onMount(()=>fetchQueue.start())

	function refreshConfigStore(ver) {
		if (ver != $uistates_store.config_version) {
			console.log("refreshConfigStore")
			fetchQueue.add(config_store.download().then($uistates_store.config_version=ver))
		}
	}

	function refreshSchedulestore(ver) {
		if (ver != $uistates_store.schedule_version) {
			console.log("add refreshSchedulestore")
			fetchQueue.add(schedule_store.download().then($uistates_store.schedule_version=ver))
		}
	}

	function refreshPlanStore(ver) {
		if (ver != $uistates_store.schedule_plan_version) {
			console.log("add refreshPlanstore")
			fetchQueue.add(plan_store.download().then($uistates_store.schedule_plan_version=ver))
		}
	}

	function refreshClaimsTargetStore(ver) {
		if (ver != $uistates_store.claims_version) {
			console.log("add refreshClaimsTargetStore")
			fetchQueue.add(claims_target_store.download().then($uistates_store.claims_version=ver))
			// console.log("add refreshClaimsStore")
			// fetchQueue.add(claim_store.download())
			if ($status_store.manual_override) {
				console.log("add refreshOverrideStore")
				fetchQueue.add(override_store.download())
			}
		}
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

	// function refreshStatusStore() {
	// 	console.log("add refreshStatusStore")
	// 	fetchQueue.add(status_store.download())
	// }

	// Refresh stores when new version is published over websocket
	$: refreshConfigStore($status_store.config_version)
	$: refreshSchedulestore($status_store.schedule_version)
	$: refreshPlanStore($status_store.schedule_plan_version)
	$: refreshClaimsTargetStore($status_store.claims_version)
	$: getMode($claims_target_store.properties.state,$claims_target_store.claims.state)

</script>

<WebSocket />