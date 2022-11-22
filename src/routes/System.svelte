<script>
	import Status from "../components/blocks/Status.svelte"
	import Network from "../components/blocks/configuration/Network.svelte"
	import Time from "../components/blocks/configuration/Time.svelte"
	import Hardware from "../components/blocks/configuration/Hardware.svelte"
</script>


<div class="container py-3 px-3">
	<Status />
	<!-- <Breadcrumb /> -->
	<div class="columns">
		<div class="column">
			<Network />
			<Hardware />
		</div>
		<div class="column">
			<Time />
		</div>
	</div>
</div>
