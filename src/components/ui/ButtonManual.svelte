<script>
	export let mode // 0: Auto, 1: On, 2: OFF
	export let setmode = (m,c) => {}
	export let mode0 = "Auto"
	export let mode1 = "Charge ON"
	export let mode2 = "Charge OFF"
	export let isauto = false
	
</script>

<style>
	.manual-charge {
		margin: 0
	}
	.buttonblock {
		width: fit-content; 

		
	}
</style>

<div class="mb-2 mt-3 is-flex is-flex-wrap-nowrap buttonblock mx-auto ">
	{#if isauto}
	<button class="mr-1 button manual-charge is-size-6 has-tooltip-arrow {mode == 1?"":"is-outlined"} is-primary" data-tooltip="Enable Charge"
			on:click={() => {setmode(1)}}>{mode1}
	</button>

	<button class="mr-1 button manual-charge is-size-6 has-tooltip-arrow  {mode == 0?"":"is-outlined"} is-info" data-tooltip="Scheduled Charge"
			on:click={() => { setmode(0)}}>{mode0}
	</button>
	{:else}
	<button class="mr-1 button manual-charge is-size-6 has-tooltip-arrow {mode == 0 || mode == 1?"":"is-outlined"} is-primary" data-tooltip="Enable Charge"
			on:click={() => { setmode(0)}}>{mode1}
	</button>
	{/if}
	<button class="button manual-charge is-size-6 has-tooltip-arrow  {mode == 2?"":"is-outlined"} is-danger" data-tooltip="Disable Charge"
			on:click={() => { setmode(2)}}>{mode2}</button>
</div>