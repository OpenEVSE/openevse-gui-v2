<script>
	import {status_store} from '../../../lib/stores/status.js'
	import {config_store} from "../../../lib/stores/config.js"
	import InputForm from "../../ui/InputForm.svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons/index.js'
	import WifiDisplay from "./WifiDisplay.svelte"
	import Button from "../../ui/Button.svelte"
	import WifiScan from "./WifiScan.svelte"
	import Box from "../../ui/Box.svelte"

	function displayMode(mode) {
		switch (mode) {
			case "AP":
			return "Access Point (AP)";
		case "STA":
			return "Client (STA)";
		case "STA+AP":
			return "Client + Access Point (STA+AP)";
		case "Wired":
			return "Wired Ethernet";
		}
	}

	let setWifi = false
	let input_host_status = 0

	function selectWifi() {
		setWifi = true
	}

	async function onChange(prop,val) {
		input_host_status = 1
		let res = await config_store.saveParam(prop, val)
		if (res) {
			input_host_status = 2 //ok
		}
		else input_host_status = 3 //error
		return res
	}
</script>

<Box title="Network" icon="mdi:local-area-network">
	<span class="is-size-6 has-text-weight-bold">
		 	Mode: 
	</span>
	<span>{displayMode($status_store.mode)}</span>

	{#if $status_store.mode != "Wired"}
	<div class="my-3">
				{#if setWifi == false}
				<WifiDisplay ssid={$config_store.ssid} rssi={$status_store.srssi}/>
				<div class="mt-3" >
					<Button name="Change WiFi Network" butn_submit={selectWifi}/>
				</div>
				{:else}
				<WifiScan bind:active={setWifi} ssid={$config_store.ssid}/>
				{/if}
	</div>
	{/if}
	<div class="my-2">
		<span class="has-text-weight-bold is-size-6">IP adress: </span><span>{$status_store.ipaddress}</span>
	</div>
	<div class="my-2 is-align-items-center">
		<span class="has-text-weight-bold is-size-6">Connected: </span>
			<Fa class="pt-1 ml-2 is-size-5 {$status_store.net_connected==1?"has-text-primary":"has-text-danger"}" icon={$status_store.net_connected==1?faCircleCheck:faCircleXmark} />
	</div>

	<InputForm type="text" title="Host Name" placeholder="OpenEVSE host name" bind:value={$config_store.hostname} 
		status={input_host_status} onChange={()=>onChange("hostname", $config_store.hostname)}/>
</Box>