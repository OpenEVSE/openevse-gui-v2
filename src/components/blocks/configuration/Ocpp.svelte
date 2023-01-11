<script>
	import AlertBox from "./../../ui/AlertBox.svelte";
	import { status_store } from "./../../../lib/stores/status.js";
	import Switch from "./../../ui/Switch.svelte";
	import { config_store }	 from "./../../../lib/stores/config.js";
	import { serialQueue }	 from "./../../../lib/queue.js";
	import OcppHelp 		 from "./../../help/OcppHelp.svelte";
	import Borders 			 from "./../../ui/Borders.svelte";
	import { _ } 		   	 from 'svelte-i18n'
	import InputForm 		 from "./../../ui/InputForm.svelte";
	import Button 			 from "./../../ui/Button.svelte";
	import Box 				 from "./../../ui/Box.svelte";

	let alert_body
	let alert_visible = false
	let stg_submit_state
	let stg_submit = async () => {

		if (!$config_store.ocpp_server) {
			alert_body = $_("config.ocpp.missing-server")
			alert_visible=true
			return false
		}
		if (!$config_store.ocpp_chargeBoxId) {
			alert_body = $_("config.ocpp.missing-chargeBoxId")
			alert_visible=true
			return false
		}
		if (!$config_store.ocpp_authkey) {
			alert_body = $_("config.ocpp.missing-authkey")
			alert_visible=true
			return false
		}
		stg_submit_state = "loading"

		const data = {
			ocpp_server: $config_store.ocpp_server,
			ocpp_chargeBoxId: $config_store.ocpp_chargeBoxId,
			ocpp_authkey: $config_store.ocpp_authkey,
			ocpp_auth_auto: $config_store.ocpp_auth_auto,
			ocpp_auth_offline: $config_store.ocpp_auth_offline,
			ocpp_suspend_evse: $config_store.ocpp_suspend_evse,
			ocpp_energize_plug: $config_store.ocpp_energize_plug
		}

		if ($config_store.ocpp_auth_auto) {
			if (!$config_store.ocpp_idtag) {
				alert_body = $_("config.ocpp.missing-idtag")
				alert_visible=true
				return false
			}
			data.ocpp_idtag = $config_store.ocpp_idtag
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

	async function toggleOCPP() {	
		await serialQueue.add(() => config_store.saveParam("ocpp_enabled", $config_store.ocpp_enabled))
	}



</script>

<Box title={$_("config.titles.ocpp")} icon="custom:arduinoocpp" has_help={true} back={true}>
	<div slot="help">
		<OcppHelp />
	</div>
	<div class="pb-2">
		<div class="mb-2">
			<Switch name="ocpp_switch" label={$_("config.ocpp.enable")} onChange={toggleOCPP} bind:checked={$config_store.ocpp_enabled}/>
		</div>
		{#key $status_store.ocpp_connected}
		<div class:is-hidden={!$config_store.ocpp_enabled} class="has-text-weight-bold {$status_store.ocpp_connected?"has-text-primary":"has-text-danger"}">
			{$_("config.ocpp.connected")}: {$status_store.ocpp_connected?$_("yes"):$_("no")}
		</div>
		{/key}
		<InputForm title="{$_("config.ocpp.server")}*:" bind:value={$config_store.ocpp_server} placeholder="wss://domain/steve/websocket/CentralSystemService" />
		<div class="mr-2">
			<InputForm title="{$_("config.ocpp.chargeBoxId")}*:" bind:value={$config_store.ocpp_chargeBoxId} is_inline />
		</div>
		<div class="mb-4">
			<InputForm title="{$_("config.ocpp.authkey")}*:" type="password" bind:value={$config_store.ocpp_authkey} placeholder={$_("config.ocpp.authkey-desc")}/>
		</div>
		<div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
			<Borders>
				<div class="m-4">
					<div class="has-text-weight-bold has-text-info mb-2">{$_("config.ocpp.auth")}</div>
					<div class="is-flex is-flex-direction-column is-align-items-start mb-4">
							<Switch name="ocpp_auto" label={$_("config.ocpp.auth-auto")} bind:checked={$config_store.ocpp_auth_auto}/>
						<div class:is-hidden={!$config_store.ocpp_auth_auto}>
							<InputForm title="{$_("config.ocpp.idtag")}*:" bind:value={$config_store.ocpp_idtag} placeholder="F4D1A7694ECD21" is_inline />
						</div>
							<Switch name="ocpp_auth_offline" label={$_("config.ocpp.auth-offline")} bind:checked={$config_store.ocpp_auth_offline}/>
					</div>
					<div class="has-text-weight-bold has-text-info my-2">{$_("config.ocpp.controls")}</div>
					<div class="is-flex is-flex-direction-column is-align-items-start">
						<Switch name="ocpp_suspend" label={$_("config.ocpp.suspend-evse")} bind:checked={$config_store.ocpp_suspend_evse}/>
						<Switch name="ocpp_energize_plug" label={$_("config.ocpp.energize-plug")} bind:checked={$config_store.ocpp_energize_plug}/>
					</div>
				</div>
			</Borders>
		
		</div>
		<div class="block mt-2 ">
			<Button name={$_("save")} color="is-info" state={stg_submit_state} butn_submit={stg_submit} />
		</div>
		<AlertBox body={alert_body} bind:visible={alert_visible} />
	</div>
</Box>