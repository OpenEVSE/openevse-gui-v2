<script>
	import Tabs from "./../components/ui/Tabs.svelte";
	import Network from "../components/blocks/configuration/Network.svelte"
	import Time from "../components/blocks/configuration/Time.svelte"
	import Firmware from "../components/blocks/configuration/Firmware.svelte"
	let tabs = [
		{name: "Network",url: "/configuration/"},
		]  // [{name: "name", url: "/", action: function}, ...]
</script>


<div class="columns">
	<div class="column">
		<Tabs />
		<Network />
		<Firmware />
	</div>
	<div class="column">
		<Time />
	</div>
</div>
