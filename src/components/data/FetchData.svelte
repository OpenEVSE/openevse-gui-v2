<script>
	import {uistates_store} from "../../lib/stores/uistates.js"
	import {schedule_store} from "../../lib/stores/schedule.js"
	import {plan_store} from "../../lib/stores/plan.js"
	import {config_store} from "../../lib/stores/config.js"
	import {claim_store} from "../../lib/stores/claim.js"


	let status = "Loading"

	async function loadData() {
		//status = "Loading Status"
		//await status_store.download()
		status = "Loading Schedule"
		await schedule_store.download()
		status = "Loading Schedule Plan"
		await plan_store.download()
		status = "Loading Configuration"
		await config_store.download()
		status = "Get Claim"
		await claim_store.getClaim()
		// status = "Get Override"
		// await override_store.getOverride()
		//$uistates_store.manual_override = $status_store.manual_override
		status = "Ok"
		$uistates_store.data_loaded = true;
	}
	
	loadData()
</script>

<div class="pageloader {status!="Ok"?"is-active":""}"><span class="title">{status}</span></div>
