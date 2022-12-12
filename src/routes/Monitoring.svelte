<script>
	import Status from "../components/blocks/Status.svelte"
	import Safety from "../components/blocks/monitoring/Safety.svelte"
	import Energy from "../components/blocks/monitoring/Energy.svelte"
	import Sensors from "../components/blocks/monitoring/Sensors.svelte"
	import Current from "../components/blocks/monitoring/Current.svelte"
</script>
<div class="columns  mb-0 is-centered pt-3">
	<div class="column my-0 py-0">
		<Energy />
		<Current />
	</div>
	<div class="column my-0 py-0">
		<Sensors />	
		<Safety />	
	</div>
</div>
