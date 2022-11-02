<script>
import {status_store} from '../../lib/stores/status.js'
import {config_store} from "../../lib/stores/config.js"
import InputFormMini from "../ui/InputFormMini.svelte"
import Fa from 'svelte-fa/src/fa.svelte'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons/index.js'
import WifiDisplay from "./WifiDisplay.svelte"
import WifiScan from "./WifiScan.svelte"

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
	let res = await config_store.setConfig(prop, val)
	if (res.msg == "done" || res.msg =="no change") {
		input_host_status = 2 //ok
	}
	else input_host_status = 3 //error
	return res
}

</script>

<style>
		.box {
			max-width : 600px;
			min-width: 300px;
		}


</style>

<div class="box is-flex-grow-1 is-flex-shrink-0 mx-2">
	<div class="has-text-weight-bold is-size-5 mb-5">Network</div>
	<span class="is-size-6 has-text-weight-bold">
		 	Mode: 
	</span>
	<span>{displayMode($status_store.mode)}</span>

	{#if $status_store.mode != "Wired"}
	<div class="my-3">
				{#if setWifi == false}
				<WifiDisplay ssid={$config_store.ssid} rssi={$status_store.srssi}/>
				<button class="button is-info is-outlined mt-2" on:click={selectWifi}>Change WiFi Network</button>
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

	<InputFormMini type="text" title="Host Name" placeholder="OpenEVSE host name" bind:value={$config_store.hostname} 
		status={input_host_status} onChange={()=>onChange("hostname", $config_store.hostname)}/>
</div>