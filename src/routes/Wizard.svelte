<script>
	import { status_store } from "./../lib/stores/status.js";
	import WizardBoxButtons   from "./../components/ui/WizardBoxButtons.svelte";
	import Time 			  from "./../components/blocks/configuration/Time.svelte";
	import Firmware 		  from "./../components/blocks/configuration/Firmware.svelte";
	import EvseLight 		  from "./../components/blocks/configuration/EvseLight.svelte";
	import Network			  from "./../components/blocks/configuration/Network.svelte";
	import Welcome	 		  from "./../components/blocks/configuration/Welcome.svelte";
	import { uistates_store } from "./../lib/stores/uistates.js";
	import { onMount } 		  from "svelte";
	import {location} 		  from 'svelte-spa-router'
	import { _ } 		   	  from 'svelte-i18n'

	export let params = {}

	onMount(()=> {
		if (params.step)
		$uistates_store.wizard_step = parseInt(params.step)
	})

	$: params.step, $uistates_store.wizard_step = parseInt(params.step)?parseInt(params.step):0

</script>
<style>
	/* .columns {
		height: 90%;
	} */
</style>

<div class="container">
	<div class="columns is-mobile is-centered is-vcentered p-0 m-0" >
	
		<div class="column  is-three-quarters-tablet is-two-thirds-desktop">
			<WizardBoxButtons bind:step={$uistates_store.wizard_step}/>
			{#if params.step == 0 || params.step == undefined}
			<Welcome />
			{:else if params.step == 1}
			<EvseLight />
			{:else if params.step == 2}
			<Network/>
			{:else if params.step == 3}
			<Time />
			{:else if params.step == 4}
			<Firmware />
			{/if}	
		</div>
	</div>	
</div>
