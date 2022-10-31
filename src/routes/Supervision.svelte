<script>
	import Status from "../components/blocks/Status.svelte"
	import Safety from "../components/blocks/Safety.svelte"
	import Sensors from "../components/blocks/Sensors.svelte"

	
</script>

<style>
		
		
</style>

<div class="container px-3">
	<Status />
	<div class="is-flex is-flex-wrap-wrap is-justify-content-space-evenly is-align-items-flex-start ">
		<Safety />
		<Sensors />
	</div>
</div>