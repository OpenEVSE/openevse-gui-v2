<script>
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store } 	from "../../../lib/stores/config.js";
	import { serialQueue } 		from "../../../lib/queue.js";
	import InputForm 			from "../../ui/InputForm.svelte";
	import Box 					from "../../ui/Box.svelte";
	import Button				from "../../ui/Button.svelte";
	import Switch 				from "../../ui/Switch.svelte";
	import AlertBox 			from "../../ui/AlertBox.svelte"

	let stg_submit_state
	let alert_body
	let alert_visible = false

	async function toggleShaper() {	
		let res = await serialQueue.add(() => config_store.saveParam("current_shaper_enabled", $config_store.current_shaper_enabled))
	}

	let stg_submit = async () => {
		if (!$config_store.current_shaper_max_pwr) {
			alert_body = "Max Power allowed is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.mmqtt_live_pwr) {
			alert_body = "Live power load MQTT Topic c is missing"
			alert_visible=true
			return
		}
		stg_submit_state = "loading"
	
		const data = {
			current_shaper_max_pwr: $config_store.current_shaper_max_pwr,
			mqtt_live_pwr: $config_store.mqtt_live_pwr
		}

		if (await config_store.upload(data)) 
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

<Box title="Shaper" icon="fa6-solid:building-shield">
	<div class="my-3" class:is-hidden={!$config_store.current_shaper_enabled}>
		<div class="is-size-7 {$status_store.shaper_updated?"has-text-primary":"has-text-danger"}">{$status_store.shaper_updated?"Live Power Load data up to date, throttling current...":"Waiting for Live Power Load data"}</div>
		<span class="is-size-7 has-text-weight-bold">Load: <span class="has-text-info">{$status_store.shaper_live_pwr} W</span></span>
		<span class="is-size-7 has-text-weight-bold">Current Available: <span class="{$status_store.shaper_cur < 6?"has-text-danger":"has-text-primary"}">{$status_store.shaper_cur} A</span></span>
	</div>
	<Switch name="shaperswitch" label="Enable Shaper" onChange={toggleShaper} bind:checked={$config_store.current_shaper_enabled}/>
	<div class="is-size-7">Throttle charge current following your house loads to prevent exceeding what your energy plan can deliver.</div>
	<div><InputForm title="Max power allowed (in W):" type="number" bind:value={$config_store.current_shaper_max_pwr} placeholder="9000" /></div>
	<div><InputForm title="Live power load MQTT Topic (in W):" bind:value={$config_store.mqtt_live_pwr} placeholder="/topic/powerload" /></div>
	<div class="block mt-5 pb-1">
		<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</Box>