<script>
	import InputForm from "./../../ui/InputForm.svelte";
	import Box from "../../ui/Box.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import Button from "./../../ui/Button.svelte";
	import { serialQueue } from "./../../../lib/queue.js";
	import Switch from "./../../ui/Switch.svelte";
	let stg_submit_state

	async function toggleShaper() {	
		let res = await serialQueue.add(() => config_store.saveParam("current_shaper_enabled", $config_store.current_shaper_enabled))
	}

	let stg_submit = async () => {
		stg_submit_state = "loading"
	
		const data = {

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

<Box title="Unballaster">
	<Switch name="shaperswitch" label="Enable Unballaster" onChange={toggleShaper} bind:checked={$config_store.current_shaper_enabled} is_rtl={true}/>
	<div class="is-size-7">Throttle charge current following your house loads to prevent exceeding what your energy plan can deliver.</div>
	<InputForm title="Max power allowed (in W):" bind:value={$config_store.current_shaper_max_pwr} placeholder="9000" />
	<InputForm title="Live power load MQTT Topic (in W):" bind:value={$config_store.mqtt_live_pwr} placeholder="/topic/powerload" />
	<div class="block mt-5">
		<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
</Box>