<script>
	import Status from "../components/blocks/Status.svelte"
	import Safety from "../components/blocks/Safety.svelte"
	import Sensors from "../components/blocks/Sensors.svelte"
</script>

<div class="container px-3">
	<Status />
	<div class="columns">
		<div class="column">
			<Safety />
		</div>
		<div class="column">
			<Sensors />
		</div>
	</div>
</div>