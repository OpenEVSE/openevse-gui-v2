<script>
	import CircularBolt from "./../ui/svg/circular_bolt.svelte";


	import { onMount } from "svelte";
	import { uistates_store }		from "./../../lib/stores/uistates.js"
	import { status_store }			from "./../../lib/stores/status.js"
	import { schedule_store } 		from "./../../lib/stores/schedule.js"
	import { plan_store } 			from "./../../lib/stores/plan.js"
	import { config_store } 		from "./../../lib/stores/config.js"
	import { claims_target_store } 	from "./../../lib/stores/claims_target.js";
	// import { claim_store } 			from "./../../lib/stores/claim.js"
	import { override_store } from "./../../lib/stores/override.js";



	let status = "Loading"

	async function loadData() {
		status = "Loading Status"
		await status_store.download()
		status = "Loading Schedule"
		await schedule_store.download()
		$uistates_store.schedule_version = $status_store.schedule_version
		status = "Loading Schedule Plan"
		await plan_store.download()
		$uistates_store.schedule_plan_version = $status_store.schedule_plan_version
		status = "Loading Configuration"
		await config_store.download()
		$uistates_store.config_version = $status_store.config_version
		status = "Get Override"
		if($status_store.manual_override)
			await override_store.download()
			$uistates_store.override_version = $status_store.override_version
		// status = "Get Claim"
		// await claim_store.download()
		status = "Get Claims Target"
		await claims_target_store.download()
		status = "Ok"
		$uistates_store.claims_version = $status_store.claims_version
		$uistates_store.data_loaded = true;
	}
	onMount(() => {
		loadData()
	})

</script>

<div class="pageloader is-info {status!="Ok"?"is-active":""}">
	<div class="title">
		<div class="is-flex is-justify-content-center is-align-items-center my-3 is-size-4">
			Hold on...
		</div>
		{status}
	</div>
</div>
