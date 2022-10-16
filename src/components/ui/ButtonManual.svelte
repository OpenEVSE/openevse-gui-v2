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

<div class="">
	<div>
		<button class="button manual-charge is-size-6 mt-3 has-tooltip-arrow {mode == 1?"":"is-outlined"} is-primary" data-tooltip="Enable Charge"
				on:click={() => {setmode(1,checked)}}>Activate</button>
		<button class="button manual-charge is-size-6 mt-3 has-tooltip-arrow  {mode == 0?"":"is-outlined"} is-info" data-tooltip="Scheduled Charge"
				on:click={() => { setmode(0,checked)}}>Auto</button>
		<button class="button manual-charge is-size-6 mt-3 has-tooltip-arrow  {mode == 2?"":"is-outlined"} is-danger" data-tooltip="Disable Charge"
				on:click={() => { setmode(2,checked)}}>Disable</button>
	</div>
	<div class="is-inline-block field mt-2 has-tooltip-arrow has-tooltip-right" data-tooltip="Release manual override when vehicle is disconnected">
	<input class="is-checkradio" name="autorelease"  bind:checked={checked} type="checkbox" >
	<label for="autorelease">Auto-release</label>
	</div>
</div>