<script>
	import { onMount }		from "svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import VehicleTesla 	from "./VehicleTesla.svelte";
	import VechicleMQTT 	from "./VechicleMQTT.svelte";
	import Box 				from "../../ui/Box.svelte";
	import Select 			from "./../../ui/Select.svelte";
	
	let mode = 0 // 0: none, 1: Tesla, 2: MQTT
	let modes = [{name: "None/HTTP", value: 0}, {name:"Tesla", value: 1}, {name: "MQTT", value: 2}]
	let range_unit = [{name: "km", value: false}, {name: "miles", value: true}]

	function getMode() {
		if ($config_store.tesla_enabled)
			mode = 1
		else if ($config_store.mqtt_vehicle_soc)
			mode = 2
		else mode = 0
	}

	onMount(() => {
		getMode()
	})
</script>


<div>
	<Select title="Connection Type" bind:value={mode} items={modes} />
	{#if mode == 2}
	<VechicleMQTT />
	{:else if mode == 1}
	<VehicleTesla />
	{:else}
	<div class="is-size-7 mt-1">Select the vehicle connection type</div>
	<div class="block mt-5">
		<h5>HTTP Push (Always Active)</h5>
		To update manually vehicule data, send HTTP POST request to:
		<div class="has-text-weoight-bold">http://&#123;OPENEVSE IP&#125;/status</div>
		containing json data in body:<br>
		<code>
		&#123;<br>
		  "battery_level": int, // SOC (%)<br>
		  "battery_range": int, // Range (km/miles)<br>
		  "time_to_full_charge": int // charge ETA (sec)<br>
		  &#125;<br>
		</code>
	</div>
	{/if}
</div>

