<script>
	import { serialQueue } from "./../../../lib/queue.js";
	import Button from "./../../ui/Button.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import InputForm from "./../../ui/InputForm.svelte";
	import AlertBox from "../../ui/AlertBox.svelte"
	import Select from "./../../ui/Select.svelte";

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

<div class="mt-1">
	<Select title="Range Unit" bind:value={$config_store.mqtt_vehicle_range_miles} items={range_unit} />
	<InputForm title="State of Charge topic:" bind:value={$config_store.mqtt_vehicle_soc} placeholder="topic/soc" is_inline={true} />
	<div class="is-size-7">The battery level of charge as a percentage</div>
	<InputForm title="Range topic:" bind:value={$config_store.mqtt_vehicle_range} placeholder="topic/range" is_inline={true}/>
	<div class="is-size-7">The range (on electric) of the vehicle based on the current battery level</div>
	<InputForm title="Time to charge topic:" bind:value={$config_store.mqtt_vehicle_eta} placeholder="topic/timeleft" is_inline={true} />
	<div class="is-size-7">The time until the battery is fully charged in seconds</div>
	<div class="block mt-5">
		<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</div>