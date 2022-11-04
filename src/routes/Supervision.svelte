<script>
	import Status from "../components/blocks/Status.svelte"
	import Safety from "../components/blocks/supervision/Safety.svelte"
	import Energy from "../components/blocks/supervision/Energy.svelte"
	import Sensors from "../components/blocks/supervision/Sensors.svelte"
</script>

<div class="container px-3">
	<Status />
	<div class="columns">
		<div class="column">
			<Safety />
		</div>
		<div class="column">
			<Sensors />
			<Energy />
		</div>
	</div>
</div>