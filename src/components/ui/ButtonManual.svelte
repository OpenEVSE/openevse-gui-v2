<script>
	export let mode // 0: Auto, 1: On, 2: OFF
	export let setmode = (m,c) => {}
	export let checked = true
	
</script>

<style>
	.manual-charge {
		margin: 0
	}
</style>

<button class="button manual-charge is-size-6 mt-3 has-tooltip-arrow {mode == 1?"":"is-outlined"} is-primary" data-tooltip="Enable Charge"
		on:click={() => {setmode(1,checked)}}>Activate</button>
<button class="button manual-charge is-size-6 mt-3 has-tooltip-arrow  {mode == 0?"":"is-outlined"} is-info" data-tooltip="Scheduled Charge"
		on:click={() => { setmode(0,checked)}}>Auto</button>
<button class="button manual-charge is-size-6 mt-3 has-tooltip-arrow  {mode == 2?"":"is-outlined"} is-danger" data-tooltip="Disable Charge"
		on:click={() => { setmode(2,checked)}}>Disable</button>
<div class="mt-2">
	<label class="checkradio has-text-weight-semibold">
		<input type="checkbox" class="has-tooltip-arrow has-tooltip-right" data-tooltip="Release manual override when vehicle is disconnected" bind:checked={checked}>
		Auto-release
	</label>
</div>