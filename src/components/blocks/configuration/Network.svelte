<script>
	import { _ } 		   from 'svelte-i18n'
	import { serialQueue } from "./../../../lib/queue.js";
	import {status_store}  from '../../../lib/stores/status.js'
	import {config_store}  from "../../../lib/stores/config.js"
	import InputForm 	   from "../../ui/InputForm.svelte"
	import WifiDisplay 	   from "./WifiDisplay.svelte"
	import Button 		   from "../../ui/Button.svelte"
	import WifiScan 	   from "./WifiScan.svelte"
	import Box 			   from "../../ui/Box.svelte"
	
	
	export let is_wizard = false

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

	let setWifi = false
	let input_host_status = 0

	function selectWifi() {
		setWifi = true
	}

	async function onChange(prop,val) {
		input_host_status = 1
		let res = await serialQueue.add(()=>config_store.saveParam(prop, val))
		if (res) {
			input_host_status = 2 //ok
		}
		else input_host_status = 3 //error
		return res
	}
</script>

<Box title={$_("config.titles.network")} icon="mdi:local-area-network" back={true}>
	<span class="is-size-6 has-text-weight-bold">
		 	{$_("config.network.mode")}:
	</span>
	<span>{displayMode($status_store.mode)}</span>

	{#if $status_store.mode != "Wired"}
	<div class="my-3">
				{#if setWifi == false && $config_store.ssid}
				<WifiDisplay ssid={$config_store.ssid} rssi={$status_store.srssi}/>
				<div class="mt-3" >
					<Button name={$_("config.network.change")} butn_submit={selectWifi}/>
				</div>
				{:else}
				<WifiScan bind:active={setWifi} ssid={$config_store.ssid} {is_wizard}/>
				{/if}
	</div>
	{/if}
	<div class="my-2">
		<span class="has-text-weight-bold is-size-6">{$_("config.network.ip")}: </span><span>{$status_store.ipaddress}</span>
	</div>
	<div class="my-2 is-flex is-align-items-center">
		<span class="has-text-weight-bold is-size-6">{$_("config.network.connected")}: </span>
		<iconify-icon inline class="ml-2 is-size-5 {$status_store.net_connected==1?"has-text-primary":"has-text-danger"}" icon={$status_store.net_connected==1?"fa6-solid:circle-check":"fa6-solid:circle-xmark"}></iconify-icon>
	</div>

	<InputForm type="text" title={$_("config.network.host")} placeholder="openevse" bind:value={$config_store.hostname} 
		status={input_host_status} onChange={()=>onChange("hostname", $config_store.hostname)}/>
</Box>