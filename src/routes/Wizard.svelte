<script>
	import Time 			  from "./../components/blocks/configuration/Time.svelte";
	import Firmware 		  from "./../components/blocks/configuration/Firmware.svelte";
	import Evse 			  from "./../components/blocks/configuration/Evse.svelte";
	import Network			  from "./../components/blocks/configuration/Network.svelte";
	import Welcome	 		  from "./../components/blocks/configuration/Welcome.svelte";
	import Logo 			  from "./../assets/logo-mini.png"
	import { uistates_store } from "./../lib/stores/uistates.js";
	import { onMount } 		  from "svelte";
	import {push} 			  from 'svelte-spa-router'
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


<div>
	<div class="has-text-centered">
		<img src={Logo} alt="logo" />
		<div class="has-text-white is-size-5">SETUP - {$uistates_store.wizard_step}/4 </div>
	</div>

	<div class="columns is-centered">
		<div class="column is-two-thirds ">
	
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
	<div class="is-flex is-justify-content-center">
			{#if $uistates_store.wizard_step > 0}
			<button class="button is-white mr-4" on:click={goPrev}>
				<iconify-icon class="is-size-5" icon="material-symbols:navigate-before"></iconify-icon> 
				Previous &nbsp;
			</button>
			{/if}
			{#if $uistates_store.wizard_step < 4}
			<button class="button is-white ml-4" on:click={goNext}>
				&nbsp; Next
				<iconify-icon class="is-size-5" icon="material-symbols:navigate-next"></iconify-icon> 
			</button>
			{/if}
			{#if $uistates_store.wizard_step == 4}
			<button class="button is-white ml-4"on:click={()=>push("/")}>
				&nbsp; Quit Wizard &nbsp;
			</button>
			{/if}
	</div>
</div>