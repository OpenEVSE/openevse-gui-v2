<script>
	let mode = 0 // 0: Auto, 1: On, 2: OFF
	
</script>

<style>
	.manual-charge {
		margin: 0
	}
</style>

<button class="button manual-charge is-size-6 mt-3  {mode == 0?"":"is-outlined"} is-info" on:click={() => { mode = 0}}>Auto</button>
<button class="button manual-charge is-size-6 mt-3  {mode == 1?"":"is-outlined"} is-primary" on:click={() => { mode = 1}}>On</button>
<button class="button manual-charge is-size-6 mt-3  {mode == 2?"":"is-outlined"} is-danger" on:click={() => { mode = 2}}>Off</button>