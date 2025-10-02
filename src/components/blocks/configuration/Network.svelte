<script>
	import { onMount } 			from "svelte";
	import WifiScan 			from "./WifiScan.svelte"
	import { submitFormData } 	from "./../../../lib/utils.js";
	import { _ } 		   		from 'svelte-i18n'
	import { serialQueue } 		from "./../../../lib/queue.js"
	import {status_store}		from './../../../lib/stores/status.js'
	import {config_store}	  	from "./../../../lib/stores/config.js"
	import InputForm 	   		from "./../../ui/InputForm.svelte"
	import WifiDisplay 	   		from "./WifiDisplay.svelte"
	import Button 		   		from "../../ui/Button.svelte"
	import Box 			   		from "../../ui/Box.svelte"
	import Borders 				from "./../../ui/Borders.svelte"

	let setWifi = false

	let formdata = {
			hostname: 		{val: "", input: undefined, status: "", req: false},
			ap_ssid: 		{val: "", input: undefined, status: "", req: false},
			ap_pass:		{val: "", input: undefined, status: "", req: false}
	}

	function displayMode(mode) {
		switch (mode) {
			case "AP":
			return $_("config.network.modes.ap")
		case "STA":
			return $_("config.network.modes.sta")
		case "STA+AP":
			return $_("config.network.modes.staap")
		case "Wired":
			return $_("config.network.modes.wired");
		}
	}

	let updateFormData = () => {
		formdata.hostname.val = $config_store.hostname,
		formdata.ap_ssid.val  = $config_store.ap_ssid,
		formdata.ap_pass.val = $config_store.ap_pass
	}

	let setProperty = async (prop) => {
		await submitFormData({prop: prop, form: formdata})
	}


	function selectWifi() {
		setWifi = true
	}


	onMount(
		() => updateFormData()

		)


</script>

<Box title={$_("config.titles.network")} icon="mdi:local-area-network" back={true}>
	<div class="is-flex is-justify-content-center">
		<Borders grow>
			<div class="has-text-centered">
				<span class="is-size-6 has-text-weight-bold has-text-dark">
					{$_("config.network.mode")}:
				</span>
				<span>{displayMode($status_store.mode)}</span>
				<div class="">
					<span class="has-text-weight-bold is-size-6 has-text-dark">{$_("config.network.ip")}: </span><span>{$status_store.ipaddress}</span>
				</div>
				{#if $status_store.macaddress}
				<div class="">
					<span class="has-text-weight-bold is-size-6 has-text-dark">{$_("config.network.mac")}: </span><span>{$status_store.macaddress}</span>
				</div>
				{/if}
				<div class="is-flex is-align-items-center is-justify-content-center">
					<span class="has-text-weight-bold is-size-6 has-text-dark">{$_("config.network.connected")}: </span>
					<iconify-icon inline class="ml-2 is-size-5 {$status_store.wifi_client_connected||$status_store.eth_connected==1?"has-text-primary":"has-text-danger"}" icon={$status_store.wifi_client_connected||$status_store.eth_connected==1?"fa6-solid:circle-check":"fa6-solid:circle-xmark"}></iconify-icon>
				</div>
			</div>
			<div class="my-1 container">
				<InputForm is_inline type="text"
					title={$_("config.network.host")}
					placeholder="openevse"
					bind:this={formdata.hostname.input}
					bind:value={formdata.hostname.val}
					status={formdata.hostname.status}
					onChange={()=>setProperty("hostname")}/>
			</div>
		</Borders>
	</div>

	{#if $status_store.mode != "Wired"}
	<div class="is-flex is-justify-content-center">
		{#if setWifi == false && $config_store.ssid}
		<Borders grow>
			<div class="has-text-dark has-text-weight-bold">
				WiFi
			</div>
			<div class="my-3">
						<!-- {#if setWifi == false && $config_store.ssid} -->
						<WifiDisplay ssid={$config_store.ssid} rssi={$status_store.srssi}/>
						<div class="mt-3 is-flex is-justify-content-center" >
							<Button name={$_("config.network.change")} butn_submit={selectWifi}/>
						</div>
			</div>
		</Borders>
		{:else}
		<WifiScan bind:active={setWifi} ssid={$config_store.ssid}/>
		{/if}
	</div>
	{/if}

  {#if $config_store.wizard_passed }
	<div class="is-flex is-justify-content-center" >
		<Borders grow>
			<div class="my-3 has-text-dark has-text-weight-bold">{$_("config.network.modes.ap")}</div>
			{$_("config.network.apdefault")}
			<form on:submit|preventDefault>
				<div>
					<InputForm is_inline type="text" title={$_("config.network.apssid")}
						placeholder="openevse"
						bind:this={formdata.ap_ssid.input}
						bind:value={formdata.ap_ssid.val}
						bind:status={formdata.ap_ssid.status}
						onChange={()=>setProperty("ap_ssid")}/>
				</div>
				<div>
					<InputForm is_inline type="password" title={$_("config.network.appass")}
						placeholder="openevse"
						bind:this={formdata.ap_pass.input}
						bind:value={formdata.ap_pass.val}
						bind:status={formdata.ap_pass.status}
						onChange={()=>setProperty("ap_pass")}/>
				</div>
			</form>
		</Borders>
	</div>
  {/if}
</Box>
