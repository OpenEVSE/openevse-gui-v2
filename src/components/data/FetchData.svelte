<script>
	import { _ , locale } 					from 'svelte-i18n'
	import { uisettings_store } 	from "./../../lib/stores/uisettings.js";
	import { onMount } 				from "svelte";
	import { uistates_store }		from "./../../lib/stores/uistates.js"
	import { status_store }			from "./../../lib/stores/status.js"
	import { schedule_store } 		from "./../../lib/stores/schedule.js"
	import { plan_store } 			from "./../../lib/stores/plan.js"
	import { config_store } 		from "./../../lib/stores/config.js"
	import { claims_target_store } 	from "./../../lib/stores/claims_target.js"
	import { override_store } 		from "./../../lib/stores/override.js"
	import {replace}				from 'svelte-spa-router'
	import Logo 					from "./../../assets/logo-mini.png"
	import AlertBox 				from "./../ui/AlertBox.svelte"
	import ProgressBar 				from "../ui/ProgressBar.svelte";

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
		if ($uisettings_store.lang != $config_store.lang) {
			$locale = $config_store.lang
			let settings = {lang: $locale}
			uisettings_store.set({...$uisettings_store, ...settings}) 
		}
		
		progress = 60
		$uistates_store.config_version = $status_store.config_version
		status = "Loading step 5"
		res = await override_store.download()
		if (!res) {
			status = "error"
			return false
		}
		progress = 80
		$uistates_store.override_version = $status_store.override_version
		
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
			setTimeout(() => {
				// check if we need to route to Wizard 
				if (!$config_store.wizard_passed) {
					replace('/wizard')
				}
				$uistates_store.data_loaded = true;
			}, 1000);
		}
		
		
	}
	onMount(() => {
		loadData()
	})

</script>
<style>
	.fetchloader{
		background: linear-gradient(hsl(195, 78%, 30%), hsl(189, 53%, 47%));
		position: fixed;
		width: 100%;
		height: 120%;
		z-index: 1;
	}
	.loadercontent {
		width: 200px;
		height: 300px;
	}
	.logo {
		border-radius: 10px;
  		/* border: 2px solid white; */
		background: hsl(0, 0%, 96%, 95%);
		padding: 5px;
	}
</style>
<div class:is-hidden={$uistates_store.data_loaded} class="fetchloader is-info is-flex is-justify-content-center is-align-items-center {status!="Ok" && status !="error"?"is-active":""}">
	<div class="loadercontent">
		<div class="is-flex is-justify-content-center is-align-items-center">
			<!-- <span class="has-text-white is-size-3 pt-1">OPEN</span><span class="has-text-primary">EVSE</span> -->
			<div class="is-flex is-align-items-center logo p-4" ><img src={Logo} alt="logo" /></div>
			
		</div>
		<div class="mt-5"><ProgressBar value={progress} /></div>
		
	</div>
</div>
{#if status == "error"}
<AlertBox title={$_("error")} visible={true} body="Can't connect to OpenEVSE Wifi" button={true} label="Reload" closable={false} action={()=>location.reload()}/>
{/if}