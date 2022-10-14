<script>
	import { onMount } from "svelte"
	import {schedule_store} from "../../lib/stores/schedule.js"
	import {status_store} from "../../lib/stores/status.js"
	import {plan_store} from "../../lib/stores/plan.js"
	import {config_store} from "../../lib/stores/config.js"
	import {claim_store} from "../../lib/stores/claim.js"
	import {states_store} from "../../lib/stores/states.js"

	let status = "Loading"

	async function loadData() {
		status = "Loading Status"
		await status_store.download()
		status = "Loading Schedule"
		await schedule_store.download()
		status = "Loading Schedule Plan"
		await plan_store.download()
		status = "Loading Configuration"
		await config_store.download()
		status = "Get Claim"
		await claim_store.getClaim()
		status = "Ok"
		$states_store.data.loaded = true;
	}

	$: console.log(status)
	
	loadData()

</script>

<div class="pageloader {status!="Ok"?"is-active":""}"><span class="title">{status}</span></div>
