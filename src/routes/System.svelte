<script>
	import Status from "../components/blocks/Status.svelte"
	import Network from "../components/blocks/configuration/Network.svelte"
	import Time from "../components/blocks/configuration/Time.svelte"
</script>


<div class="container px-3">
	<Status />
	<div class="columns">
		<div class="column">
			<Network />
		</div>
		<div class="column">
			<Time />
		</div>
	</div>
</div>
