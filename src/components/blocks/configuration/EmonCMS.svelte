<script>
	import { _ } 		    from 'svelte-i18n'
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
			alert_body = $_("config.emon.missing-server")
			alert_visible=true
			return
		}
		else if (!$config_store.emoncms_node) {
			alert_body = $_("config.emon.missing-node")
			alert_visible=true
			return
		}
		else if (!$config_store.emoncms_apikey) {
			alert_body = $_("config.emon.missing-key")
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

<Box title={$_("config.titles.emon")} icon="fa6-solid:chart-bar" back={true}>
	<div>
		<Switch name="emoncmsswitch" label={$_("config.emon.enable")} onChange={toggleEmonCMS} bind:checked={$config_store.emoncms_enabled} is_rtl={true}/>
	</div>

	{#if $config_store.emoncms_enabled}
	<div class="is-size-7">
		<span class="">{$_("config.emon.connected")}:</span>
		{#key $status_store.emoncms_connected }
		<span class="has-text-weight-bold {$status_store.emoncms_connected == 1 ?"has-text-primary":"has-text-danger"}">{$status_store.emoncms_connected == 1 ?$_("yes"):$_("no")}</span>
		{/key}
		<span class="ml-2">{$_("config.emon.posts")}:</span>
		<span class="">{$status_store.packets_success}/{$status_store.packets_sent}</span>
	</div>
	{/if}
	
	<InputForm title="{$_("config.emon.server")}*:" bind:value={$config_store.emoncms_server} placeholder="server" />
	<div class="is-size-7">e.g: <a href="https://data.openevse.com/emoncms">data.openevse.com/emoncms</a>, <a href="https://emoncms.org/">emoncms.org</a>, <a href="http://emonpi/">emonpi</a></div>

	<InputForm title="{$_("config.emon.node")}*:" bind:value={$config_store.emoncms_node} placeholder="node name" />
	<InputForm title="{$_("config.emon.apikey")}*:" type="password" bind:value={$config_store.emoncms_apikey} placeholder="api key" />

	
	<div class="block mt-5 mb-1">
		<Button name={$_("save")} color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
	</div>
	<AlertBox body={alert_body} bind:visible={alert_visible} />
</Box>