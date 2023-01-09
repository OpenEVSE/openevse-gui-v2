<script>
	import WizardBoxButtons   from "./../components/ui/WizardBoxButtons.svelte";
	import Time 			  from "./../components/blocks/configuration/Time.svelte";
	import Firmware 		  from "./../components/blocks/configuration/Firmware.svelte";
	import Evse 			  from "./../components/blocks/configuration/Evse.svelte";
	import Network			  from "./../components/blocks/configuration/Network.svelte";
	import Welcome	 		  from "./../components/blocks/configuration/Welcome.svelte";
	import { uistates_store } from "./../lib/stores/uistates.js";
	import { onMount } 		  from "svelte";
	import {push} 			  from 'svelte-spa-router'
	
	export let params = {}

	onMount(()=> {
		if (params.step)
		$uistates_store.wizard_step = parseInt(params.step)
	})

	function goNext() {

		$uistates_store.wizard_step +=  1
		push('/wizard/' + $uistates_store.wizard_step)
	}

	function goPrev() {
		$uistates_store.wizard_step -= 1
		push('/wizard/' + $uistates_store.wizard_step)
	}
</script>
<style>
	.columns {
		height: 90%;
	}
</style>

<div class="columns is-mobile is-centered p-0 m-0" >
	
	<div class="column is-two-thirds-tablet">
		<WizardBoxButtons bind:step={$uistates_store.wizard_step}/>
		{#if params.step == 0 || params.step == undefined}
		<Welcome />
		{:else if params.step == 1}
		<Evse />
		{:else if params.step == 2}
		<Time />
		{:else if params.step == 3}
		<Network is_wizard={true}/>
		{:else if params.step == 4}
		<Firmware />
		{/if}
		
	</div>
</div>