<script>
	import Status from "../components/blocks/Status.svelte"
	import Network from "../components/blocks/configuration/Network.svelte"
	import Time from "../components/blocks/configuration/Time.svelte"
	import Hardware from "../components/blocks/configuration/Hardware.svelte"
</script>


<div class="columns">
	<div class="column">
		<Network />
		<Hardware />
	</div>
	<div class="column">
		<Time />
	</div>
</div>
