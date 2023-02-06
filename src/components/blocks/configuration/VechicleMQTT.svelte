<script>
	import { _ } 		    from 'svelte-i18n'
	import { serialQueue }  from "./../../../lib/queue.js";
	import { config_store } from "./../../../lib/stores/config.js";
	import Button 			from "./../../ui/Button.svelte";
	import InputForm 		from "./../../ui/InputForm.svelte";
	import AlertBox 		from "../../ui/AlertBox.svelte"
	import Select 			from "./../../ui/Select.svelte";

	let stg_submit_state
	let alert_body
	let alert_visible = false
	let range_unit = [{name: "km", value: false}, {name: "miles", value: true}]

	let stg_submit = async () => {

	stg_submit_state = "loading"

	const data = {
		mqtt_vehicle_soc: $config_store.mqtt_vehicle_soc,
		mqtt_vehicle_range: $config_store.mqtt_vehicle_range,
		mqtt_vehicle_eta: $config_store.mqtt_vehicle_eta,
		mqtt_vehicle_range_miles: $config_store.mqtt_vehicle_range_miles
	}

	if (await serialQueue.add(()=>config_store.upload(data))) 
		{
			stg_submit_state = "ok"
			return true
		}
	else {
		stg_submit_state = "error"
		return false
	}

}
</script>

<div class="mt-1 mb-1">
	<div>	
		<Select title="{$_("config.vehicle.rangeunit")}:" bind:value={$config_store.mqtt_vehicle_range_miles} items={range_unit} />
	</div>

	<InputForm 
		title="{$_("config.vehicle.topic-soc")}:" bind:value={$config_store.mqtt_vehicle_soc} 
		placeholder="topic/soc" 
	
	/>
	<div class="is-size-7">{$_("config.vehicle.topic-soc-desc")}</div>
	<InputForm 
		title="{$_("config.vehicle.topic-range")}:" bind:value={$config_store.mqtt_vehicle_range} 
		placeholder="topic/range" 
		/>
	<div class="is-size-7">{$_("config.vehicle.topic-range-desc")}</div>
	<InputForm 
		title="{$_("config.vehicle.topic-time2charge")}:" bind:value={$config_store.mqtt_vehicle_eta} 
			placeholder="topic/timeleft" 
		/>
	<div class="is-size-7">{$_("config.vehicle.topic-time2charge-desc")}</div>
	<div class="block mt-5">
		<Button 
			name={$_("save")}
			color="is-info" 
			state={stg_submit_state} 
			butn_submit={stg_submit} 
		/>
	</div>
	<AlertBox title={$_("error")}  body={alert_body} bind:visible={alert_visible} />
</div>