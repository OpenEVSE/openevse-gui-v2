<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faRobot, faHand} from '@fortawesome/free-solid-svg-icons/index.js'
	export let mode // 0: Auto, 1: On, 2: OFF
	export let setmode = (m,c) => {}
	export let isauto = false
	let mode1 = "ON"
	let mode2 = "OFF"
	
	$: mode, console.log("mode = " + mode)
</script>

<style>
	.manual-charge {
		margin: 0
	}
	.buttonblock {
		width: fit-content; 

		
	}
</style>

<div class="mb-2 mt-2 mb-5  is-flex is-flex-wrap-nowrap buttonblock mx-auto buttons field is-grouped">
	<button class="mr-1 button manual-charge is-size-6 has-tooltip-arrow {mode == 1?"":"is-outlined"} is-primary" data-tooltip="Enable Charge"
	on:click={() => {setmode(1)}}>&nbsp;&nbsp;&nbsp;<Fa icon={faHand} />&nbsp;&nbsp;&nbsp;
</button>
	{#if isauto}
	<button class="mr-1 button manual-charge is-size-6 has-tooltip-arrow  {mode == 0?"":"is-outlined"} is-info" data-tooltip="Let OpenEVSE decide"
			on:click={() => { setmode(0)}}>&nbsp;&nbsp;&nbsp;<Fa icon={faRobot} />&nbsp;&nbsp;&nbsp;
	</button>
	{/if}
	<button class="button manual-charge is-size-6 has-tooltip-arrow  {mode == 2?"":"is-outlined"} is-danger" data-tooltip="Disable Charge"
			on:click={() => { setmode(2)}}>&nbsp;&nbsp;&nbsp;<Fa icon={faHand} />&nbsp;&nbsp;&nbsp;
	</button>
</div>