<script>
	import Status from "../components/blocks/Status.svelte"
	import Safety from "../components/blocks/monitoring/Safety.svelte"
	import Energy from "../components/blocks/monitoring/Energy.svelte"
	import Sensors from "../components/blocks/monitoring/Sensors.svelte"
	import Current from "../components/blocks/monitoring/Current.svelte"
	import Breadcrumb from "../components/ui/Breadcrumb.svelte"
</script>

<div class="container px-3">
	<Status />
	<!-- <Breadcrumb /> -->
	<div class="columns">
		<div class="column">
			<Safety />			
		</div>
		<div class="column">
			<Sensors />
			<Energy />
			<Current />
		</div>
	</div>
</div>