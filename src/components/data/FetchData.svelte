<script>
	import AlertBox from "./../ui/AlertBox.svelte";
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
	let progress = 0
	

	async function loadData() {
		let res
		status = "Loading step 1"
		res = await status_store.download()
		if (!res) { 
			status = "error"
			return false
		}
		progress = 20
		status = "Loading step 2"
		res = await schedule_store.download()
		if (!res) {
			 status = "error"
			return false
		}
		progress = 30
		$uistates_store.schedule_version = $status_store.schedule_version
		status = "Loading step 3"
		res = await plan_store.download()
		if (!res) {
			 status = "error"
			 return false
		}
		progress = 40
		$uistates_store.schedule_plan_version = $status_store.schedule_plan_version
		status = "Loading step 4"
		res = await config_store.download()
		if (!res) { 
			status = "error"
			return false
		}
		progress = 60
		$uistates_store.config_version = $status_store.config_version
		status = "Loading step 5"
		progress = 80
		if($status_store.manual_override) {
			status = "Loading step 6"
			res = await override_store.download()
			if (!res) {
				status = "error"
				return false
			}
			progress = 90
			$uistates_store.override_version = $status_store.override_version
		}
		// status = "Get Claim"
		// await claim_store.download()
		status = "Loading step 7"
		res = await claims_target_store.download()
		if (!res) {
			 status = "error"
			 return false
		}
		if (status != "error") {
			progress = 100
			status = "Loading ok"
			$uistates_store.claims_version = $status_store.claims_version
			$uistates_store.data_loaded = true;
		}
		
	}
	onMount(() => {
		loadData()
	})

</script>
<style>
	.pageloader{
		background: linear-gradient(hsl(195, 78%, 30%), hsl(189, 53%, 47%));
	}
</style>
<div class="pageloader is-info {status!="Ok" && status !="error"?"is-active":""}">
	<div class="title">
		<div class="is-flex is-justify-content-center my-6 is-size-1">
			<span class="has-text-white is-size-3 pt-1">OPEN</span><span class="has-text-primary">EVSE</span>
		</div>
		<progress class="progress is-primary" value={progress} max="100"></progress>
	</div>
</div>
{#if status == "error"}
<AlertBox visible={true} body="OpenEVSE not responding or not connected" button={true} label="Reload" action={()=>location.reload()}/>
{/if}