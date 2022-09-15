<script>
	import Status from "./Status.svelte"
	import Charge from "./Charge.svelte"
</script>
<div class="container px-3">
	<Status />
	<div class="container">
		<div class="columns" >
			<div class="column">
				<Charge />
			</div>
			<div class="column">
				<div class="box">	
					<div class="is-size-4 has-text-weight-bold">Timers</div>
				</div>
			</div>
		</div>
	</div>
</div>