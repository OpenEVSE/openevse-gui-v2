<script>
	import Status from "../components/blocks/Status.svelte"
	import Safety from "../components/blocks/monitoring/Safety.svelte"
	import Energy from "../components/blocks/monitoring/Energy.svelte"
	import Sensors from "../components/blocks/monitoring/Sensors.svelte"
	import Current from "../components/blocks/monitoring/Current.svelte"
</script>
<div class="columns is-centered">
	<div class="column">
		<Safety />			
	</div>
	<div class="column">
		<Sensors />
		<Energy />
		<Current />
	</div>
</div>
