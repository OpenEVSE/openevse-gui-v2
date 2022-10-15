<script>
	export let mode // 0: Auto, 1: On, 2: OFF
	export let setmode = (m) => {};
	
</script>

<style>
	.manual-charge {
		margin: 0
	}
</style>

<button class="button manual-charge is-size-6 mt-3  {mode == 1?"":"is-outlined"} is-primary" on:click={() => {setmode(1)}}>Activate</button>
<button class="button manual-charge is-size-6 mt-3  {mode == 0?"":"is-outlined"} is-info" on:click={() => { setmode(0)}}>Auto</button>
<button class="button manual-charge is-size-6 mt-3  {mode == 2?"":"is-outlined"} is-danger" on:click={() => { setmode(2)}}>Disable</button>