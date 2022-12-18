<script>

	import InputForm 		from "./../../ui/InputForm.svelte";
	import Box 				from "../../ui/Box.svelte";
	import Button 			from "./../../ui/Button.svelte";
	import Switch			from "./../../ui/Switch.svelte";
	import AlertBox 		from "../../ui/AlertBox.svelte"
	import { status_store } from "./../../../lib/stores/status.js";
	import { serialQueue }  from "./../../../lib/queue.js";
	import { config_store } from "./../../../lib/stores/config.js";
	
	let stg_submit_state
	let alert_body
	let alert_visible = false

	async function toggleEmonCMS() {	
		let res = await serialQueue.add(() => config_store.saveParam("emoncms_enabled", $config_store.emoncms_enabled))
	}

	let stg_submit = async () => {
		if (!$config_store.emoncms_server) {
			alert_body = "Emoncms Server is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.emoncms_node) {
			alert_body = "Emoncms Node is missing"
			alert_visible=true
			return
		}
		else if (!$config_store.emoncms_apikey) {
			alert_body = "API Key is missing"
			alert_visible=true
			return
		}

		stg_submit_state = "loading"
	
		const data = {
			emoncms_server: $config_store.emoncms_server,
			emoncms_node: $config_store.emoncms_node,
			emoncms_apikey: $config_store.emoncms_apikey
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

<Box title="Energy Monitoring" icon="fa6-solid:chart-bar">
	<Switch name="emoncmsswitch" label="Enable Emoncms" onChange={toggleEmonCMS} bind:checked={$config_store.emoncms_enabled} is_rtl={true}/>
	{#if $config_store.emoncms_enabled}
	<div class="is-size-7">
		<span class="">Connected:</span>
		<span class="has-text-weight-bold {$status_store.emoncms_connected == 1 ?"has-text-primary":"has-text-danger"}">{$status_store.emoncms_connected == 1 ? "yes" : "no"}</span>
		<span class="ml-2">Posts:</span>
		<span class="">{$status_store.packets_success}/{$status_store.packets_sent}</span>
	</div>
	{/if}
	
	<InputForm title="Emoncms Server*:" bind:value={$config_store.emoncms_server} placeholder="server" />
	<div class="is-size-7">e.g: <a href="https://data.openevse.com/emoncms">data.openevse.com/emoncms</a>, <a href="https://emoncms.org/">emoncms.org</a>, <a href="http://emonpi/">emonpi</a></div>

	<InputForm title="Emoncms Node*:" bind:value={$config_store.emoncms_node} placeholder="node name" />
	<InputForm title="Emoncms write-apikey*:" type="password" bind:value={$config_store.emoncms_apikey} placeholder="api key" />

	
	<div class="block mt-5">
		<Button name="Save" color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</Box>