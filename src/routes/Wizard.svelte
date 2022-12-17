<script>
	import { uistates_store } from "./../lib/stores/uistates.js";
	import { config_store } from "./../lib/stores/config.js";
	import { status_store } from "./../lib/stores/status.js";
	import { onMount } from "svelte";
	import {push} from 'svelte-spa-router'
	import Firmware from "./../components/blocks/configuration/Firmware.svelte";
	import Evse from "./../components/blocks/configuration/Evse.svelte";
	import Network from "./../components/blocks/configuration/Network.svelte";
	import Welcome from "./../components/blocks/configuration/Welcome.svelte";
	import 'iconify-icon';
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


<div class="columns is-centered">
	<div class="column">
		{#if $uistates_store.wizard_step > 0}
		<button class="button is-white mr-auto ml-0" on:click={goPrev}>
			<iconify-icon class="is-size-5" icon="material-symbols:navigate-before"></iconify-icon> 
			Previous &nbsp;
			
		</button>
		{/if}
	</div>

	<div class="column is-two-thirds ">

		{#if params.step == 0 || params.step == undefined}
		<Welcome />
		{:else if params.step == 1}
		<Evse />
		{:else if params.step == 2}
		<Network is_wizard={true}/>
		{:else if params.step == 3}
		<Firmware />
		{/if}
	
		
	</div>
	<div class="column">
		{#if $uistates_store.wizard_step < 3}
		<button class="button is-white ml-auto mr-0" on:click={goNext}>
			&nbsp; Next
			<iconify-icon class="is-size-5" icon="material-symbols:navigate-next"></iconify-icon> 
		</button>
	{/if}
	</div>
	
</div>