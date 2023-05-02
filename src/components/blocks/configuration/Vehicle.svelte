<script>
	import { serialQueue } from "./../../../lib/queue.js";
	import Borders from "./../../ui/Borders.svelte";
	import { _ } 		    from 'svelte-i18n'
	import { onMount }		from "svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import VehicleTesla 	from "./VehicleTesla.svelte";
	import VechicleMQTT 	from "./VechicleMQTT.svelte";
	import Select 			from "./../../ui/Select.svelte";
	
	let mode = 0
	let selector
	let modes = [{name: $_("config.vehicle.mode.none"), value: 0}, {name:$_("config.vehicle.mode.tesla"), value: 1}, {name: $_("config.vehicle.mode.mqtt"), value: 2}, {name: $_("config.vehicle.mode.http"), value: 3}]
	onMount( () => {
		mode = $config_store.vehicle_data_src?$config_store.vehicle_data_src:0
	})

	let setDataSrc = async () => {
		const data = {
			vehicle_data_src: mode
		}
		$config_store.vehicle_data_src = mode
		selector.setStatus("loading")
		const res = await serialQueue.add(() => config_store.upload(data))
		if (res) selector.setStatus("ok")
		else selector.setStatus("error")
	}


</script>
<div class="columns is-centered">
	<div class="column is-three-quarters is-full-mobile">
		<div class="is-flex is-justify-content-center">
			<Borders grow>


					<Select bind:this={selector} title={$_("config.vehicle.contype")} bind:value={mode} items={modes} onChange={setDataSrc} />
					{#if $config_store.vehicle_data_src == 2}
					<VechicleMQTT />
					{:else if $config_store.vehicle_data_src == 1}
					<VehicleTesla />
					{:else if $config_store.vehicle_data_src == 3}
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
			</Borders>
		</div>
	</div>
</div>