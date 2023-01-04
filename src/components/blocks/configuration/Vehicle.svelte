<script>
	import { _ } 		    from 'svelte-i18n'
	import { onMount }		from "svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import VehicleTesla 	from "./VehicleTesla.svelte";
	import VechicleMQTT 	from "./VechicleMQTT.svelte";
	import Box 				from "../../ui/Box.svelte";
	import Select 			from "./../../ui/Select.svelte";
	
	let mode = 0 // 0: none, 1: Tesla, 2: MQTT
	let modes = [{name: $_("config.vehicle.mode.none"), value: 0}, {name:$_("config.vehicle.mode.tesla"), value: 1}, {name: $_("config.vehicle.mode.mqtt"), value: 2}]

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
	<Select title={$_("config.vehicle.contype")} bind:value={mode} items={modes} />
	{#if mode == 2}
	<VechicleMQTT />
	{:else if mode == 1}
	<VehicleTesla />
	{:else}
	<div class="is-size-7 mt-1">{$_("config.vehicle.contype-desc")}</div>
	<div class="block mt-5">
		<h5>{$_("config.vehicle.httppush")}</h5>
		{$_("config.vehicle.httppush-desc-1")}
		<div class="has-text-weight-bold">http://&#123;OPENEVSE IP&#125;/status</div>
		{$_("config.vehicle.httppush-desc-2")}<br>
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

