<script>
	import { status_store } from "./../../../lib/stores/status.js";
	import { config_store } from "./../../../lib/stores/config.js";
	import { serialQueue }  from "./../../../lib/queue.js";
	import InputForm 		from "./../../ui/InputForm.svelte";
	import Box 				from "../../ui/Box.svelte";
	import Button 			from "./../../ui/Button.svelte";
	import Switch 			from "./../../ui/Switch.svelte";
	import AlertBox 		from "../../ui/AlertBox.svelte"

	let stg_submit_state
	let alert_body
	let alert_visible = false

	async function toggleOhmConnect() {	
		let res = await serialQueue.add(() => config_store.saveParam("ohm_enabled", $config_store.emoncms_enabled))
	}

	let stg_submit = async () => {
		if ($config_store.ohm == "") {
			alert_body = "OhmConnect Key is missing"
			alert_visible=true
			return
		}
		stg_submit_state = "loading"
	
		const data = {
			ohm: $config_store.ohm
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

<Box title="OhmConnect" icon="mdi:energy-circle">
	<div>
		<Switch name="emoncmsswitch" label="Enable OhmConnect" onChange={toggleOhmConnect} bind:checked={$config_store.ohm_enabled} is_rtl={true}/>
	</div>
	
	<div class="is-size-7">OhmConnect monitors real-time conditions on the electricity grid. When dirty and unsustainable power plants turn on, our users receive a notification to save energy.</div>
	{#if $config_store.ohm_enabled}
	<div class="is-size-7">
		<span class="">Ohm Hour:</span>
		<span class="has-text-weight-bold {$status_store.ohm_hour == "NotConnected" ?"has-text-danger":"has-text-primary"}">{$status_store.ohm_hour}</span>
	</div>
	{/if}
	
	<InputForm title="Ohm Key:*:" bind:value={$config_store.ohm} placeholder="Key" />
	<div class="is-size-7">
		Ohm Key can be obtained by logging in to OhmConnect, enter Settings and locate the link in "Open Source Projects".<br>
		<span class="has-text-weight-bold">Example: </span><span>https://login.ohmconnect.com/verify-ohm-hour/OpnEoVse</span><br>
		<span class="has-text-weight-bold">Key:</span>OpnEoVse
	</div>

	<div class="block mt-5 mb-1">
		<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</Box>
