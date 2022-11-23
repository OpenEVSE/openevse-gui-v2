<script>
	import Network from "../components/blocks/configuration/Network.svelte"
	import Time from "../components/blocks/configuration/Time.svelte"
	import Firmware from "../components/blocks/configuration/Firmware.svelte"
</script>


<div class="columns">
	<div class="column">
		<Network />
		<Firmware />
	</div>
	<div class="column">
		<Time />
	</div>
</div>
