<script>
	import { status_store } 	from "./../../../lib/stores/status.js";
	import { config_store }	 	from "./../../../lib/stores/config.js";
	import { serialQueue }	 	from "./../../../lib/queue.js";
	import { submitFormData } 	from "./../../../lib/utils.js";
	import { onMount } 			from "svelte";
	import { _ } 		   	 	from 'svelte-i18n';
	import OcppHelp 		 	from "./../../help/OcppHelp.svelte";
	import Borders 			 	from "./../../ui/Borders.svelte";
	import InputForm 		 	from "./../../ui/InputForm.svelte";
	import Button 			 	from "./../../ui/Button.svelte";
	import Box 				 	from "./../../ui/Box.svelte";
	import Switch			 	from "./../../ui/Switch.svelte";

	let mounted = false
	const hiddenpass = "••••••••••"
	let formdata = {
			ocpp_enabled: 		{val: false,  status: "", input: undefined, req: false},
			ocpp_chargeBoxId:	{val: null,   status: "", input: undefined, req: true},
			ocpp_server:		{val: null,   status: "", input: undefined, req: true},
			ocpp_authkey:		{val: null,   status: "", input: undefined, req: false, pwd: true},
			ocpp_auth_auto:		{val: false,  status: "", input: undefined, req: false},
			ocpp_idtag:			{val: "",     status: "", input: undefined, req: false},
			ocpp_auth_offline:	{val: false,  status: "", input: undefined, req: false},
			ocpp_suspend_evse:	{val: false,  status: "", input: undefined, req: false},
			ocpp_energize_plug:	{val: false,  status: "", input: undefined, req: false}
		}	

	let updateFormData = () => {
		formdata.ocpp_enabled.val = $config_store.ocpp_enabled
		formdata.ocpp_chargeBoxId.val = $config_store.ocpp_chargeBoxId
		formdata.ocpp_server.val = $config_store.ocpp_server
		formdata.ocpp_authkey.val = $config_store.ocpp_authkey?hiddenpass:""
		formdata.ocpp_auth_auto.val = $config_store.ocpp_auth_auto
		if (formdata.ocpp_auth_auto.val)
			formdata.ocpp_idtag.req = true
		formdata.ocpp_idtag.val	 = $config_store.ocpp_idtag
		formdata.ocpp_auth_offline.val = $config_store.ocpp_auth_offline
		formdata.ocpp_suspend_evse.val = $config_store.ocpp_suspend_evse
		formdata.ocpp_energize_plug.val = $config_store.ocpp_energize_plug
	}

	
	let toggleOCPP = async () => {
		await submitFormData({form: formdata, prop_enable: "ocpp_enabled", i18n_path: "config.ocpp.missing-"})
	}


	let setProperty = async (prop) => {
		if (prop == "ocpp_auth_auto")
			formdata.ocpp_idtag.req = formdata.ocpp_auth_auto.val	
		await submitFormData({prop: prop, form: formdata , prop_enable: "ocpp_enabled", i18n_path: "config.ocpp.missing-"})
	}

	onMount( () => {
		updateFormData()
		Object.keys(formdata).forEach(key => {
			if (formdata[key].val == undefined) {
				formdata[key].val = ""
			}
		});
		mounted = true

	})
</script>
<style>
	.enable {
		min-width: 230px;
	}
	
</style>

{#if mounted}
<Box title={$_("config.titles.ocpp")} icon="custom:ocpp" has_help={true} back={true}>
	<div slot="help">
		<OcppHelp />
	</div>
	<div class="columns is-centered">
		<div class="column is-three-quarters is-full-mobile">
			
			<div class="mb-2 enable is-flex is-align-items-center is-justify-content-center">
				<Borders classes={$config_store.ohm_enabled?"has-background-primary-light":"has-background-light"}>
					<Switch 
						name="ocppswitch" 
						label={$_("enable")} 
						onChange={toggleOCPP} 
						bind:this={formdata.ocpp_enabled.input} 
						bind:checked={formdata.ocpp_enabled.val} 
						bind:status={formdata.ocpp_enabled.status} 
						disabled={formdata.ocpp_enabled.status == "loading"}
					/>
					{#key $status_store.ocpp_connected}
					<div class:is-hidden={!$config_store.ocpp_enabled} class="has-text-weight-bold {$status_store.ocpp_connected?"has-text-primary":"has-text-danger"}">
						{$_("config.ocpp.connected")}: {$status_store.ocpp_connected?$_("yes"):$_("no")}
					</div>
					{/key}
				</Borders>
			</div>
			<div class="mb-2 is-flex is-align-items-center is-justify-content-center">
				<Borders grow>
					<div class="mr-2">
						<InputForm
							title="{$_("config.ocpp.server")}*" 
							type="text"
							bind:this={formdata.ocpp_server.input} 
							bind:value={formdata.ocpp_server.val} 
							bind:status={formdata.ocpp_server.status} 
							disabled={formdata.ocpp_server.status == "loading"} 
							placeholder="wss://domain/steve/websocket/CentralSystemService" 
							onChange={()=>setProperty("ocpp_server")}
						/>
					</div>

					
					<div class="mr-2">
						<InputForm
						title="{$_("config.ocpp.chargeBoxId")}*" 
						type="text"
						bind:this={formdata.ocpp_chargeBoxId.input} 
						bind:value={formdata.ocpp_chargeBoxId.val} 
						bind:status={formdata.ocpp_chargeBoxId.status} 
						disabled={formdata.ocpp_chargeBoxId.status == "loading"} 
						onChange={()=>setProperty("ocpp_chargeBoxId")}
					/>
		
					</div>
					<div class="mr-2">
						<InputForm
							title="{$_("config.ocpp.authkey")}*" 
							type="password"
							bind:this={formdata.ocpp_authkey.input} 
							bind:value={formdata.ocpp_authkey.val} 
							bind:status={formdata.ocpp_authkey.status} 
							disabled={formdata.ocpp_authkey.status == "loading"} 
							placeholder={$_("config.ocpp.authkey-desc")}
							onChange={()=>setProperty("ocpp_authkey")}
						/>			
					</div>
				</Borders>
			</div>
			<div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
				<Borders grow>
					<div class="m-4">
						<div class="has-text-weight-bold has-text-info mb-2">{$_("config.ocpp.auth")}</div>
						<div class="is-flex is-flex-direction-column is-align-items-start mb-4">
							<Switch 
								name="ocpp_auto" 
								label={$_("config.ocpp.auth-auto")} 
								onChange={()=>setProperty("ocpp_auth_auto")} 
								bind:this={formdata.ocpp_auth_auto.input} 
								bind:checked={formdata.ocpp_auth_auto.val} 
								bind:status={formdata.ocpp_auth_auto.status} 
								disabled={formdata.ocpp_auth_auto.status == "loading"}
							/>
							<div class:is-hidden={!$config_store.ocpp_auth_auto}>
								<InputForm
									title="{$_("config.ocpp.idtag")}*" 
									type="text" is_inline
									bind:this={formdata.ocpp_idtag.input} 
									bind:value={formdata.ocpp_idtag.val} 
									bind:status={formdata.ocpp_idtag.status} 
									disabled={formdata.ocpp_idtag.status == "loading"} 
									placeholder="F4D1A7694ECD21"
									onChange={()=>setProperty("ocpp_idtag")}
								/>	
							</div>
							<Switch 
								name="ocpp_auth_offline" 
								label={$_("config.ocpp.auth-offline")} 
								onChange={()=>setProperty("ocpp_auth_offline")} 
								bind:this={formdata.ocpp_auth_offline.input} 
								bind:checked={formdata.ocpp_auth_offline.val} 
								bind:status={formdata.ocpp_auth_offline.status} 
								disabled={formdata.ocpp_auth_offline.status == "loading"}
							/>	
						</div>
						<div class="has-text-weight-bold has-text-info my-2">{$_("config.ocpp.controls")}</div>
						<div class="is-flex is-flex-direction-column is-align-items-start">
							<Switch 
								name="ocpp_suspend" 
								label={$_("config.ocpp.suspend-evse")} 
								onChange={()=>setProperty("ocpp_suspend_evse")} 
								bind:this={formdata.ocpp_suspend_evse.input} 
								bind:checked={formdata.ocpp_suspend_evse.val} 
								bind:status={formdata.ocpp_suspend_evse.status} 
								disabled={formdata.ocpp_suspend_evse.status == "loading"}
							/>
							<Switch 
							name="ocpp_energize_plug" 
							label={$_("config.ocpp.energize-plug")} 
							onChange={()=>setProperty("ocpp_energize_plug")} 
							bind:this={formdata.ocpp_energize_plug.input} 
							bind:checked={formdata.ocpp_energize_plug.val} 
							bind:status={formdata.ocpp_energize_plug.status} 
							disabled={formdata.ocpp_energize_plug.status == "loading"}
						/>
						</div>
					</div>
				</Borders>
			</div>
		</div>
	</div>
</Box>
{/if}