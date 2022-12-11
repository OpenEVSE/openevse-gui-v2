<script>
	import { onMount } from "svelte";
	import VehicleTesla from "./VehicleTesla.svelte";
	import VechicleMQTT from "./VechicleMQTT.svelte";
	import Box from "../../ui/Box.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import Select from "./../../ui/Select.svelte";
	import VehicleTeslaHelp from "./../../help/VehicleTeslaHelp.svelte";
	import {faGear} from '@fortawesome/free-solid-svg-icons/index.js'


	
	let mode = 0 // 0: none, 1: Tesla, 2: MQTT
	let modes = [{name: "None/HTTP", value: 0}, {name:"Tesla", value: 1}, {name: "MQTT", value: 2}]
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

<Box title="Vehicle" has_help={mode==1?true:false} icon={faGear}>
	<div slot="help"><VehicleTeslaHelp /> </div>
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
</Box>
