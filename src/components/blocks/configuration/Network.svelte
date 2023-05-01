<script>
	import WifiScan 			from "./WifiScan.svelte"
	import { _ } 		   		from 'svelte-i18n'
	import { serialQueue } 		from "./../../../lib/queue.js"
	import {status_store}		from './../../../lib/stores/status.js'
	import {config_store}	  	from "./../../../lib/stores/config.js"
	import InputForm 	   		from "./../../ui/InputForm.svelte"
	import WifiDisplay 	   		from "./WifiDisplay.svelte"
	import Button 		   		from "../../ui/Button.svelte"
	import Box 			   		from "../../ui/Box.svelte"
	import Borders 				from "./../../ui/Borders.svelte"
	

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
	let input_host_status

	function selectWifi() {
		setWifi = true
	}

	async function onChange(prop,val) {
		input_host_status = "loading"
		let res = await serialQueue.add(()=>config_store.saveParam(prop, val))
		if (res) {
			input_host_status = "ok"
		}
		else input_host_status = "error"
		return res
	}


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
				<div class="">
					<span class="has-text-weight-bold is-size-6 has-text-dark">{$_("config.network.mac")}: </span><span>{$status_store.macaddress}</span>
				</div>
				<div class="is-flex is-align-items-center is-justify-content-center">
					<span class="has-text-weight-bold is-size-6 has-text-dark">{$_("config.network.connected")}: </span>
					<iconify-icon inline class="ml-2 is-size-5 {$status_store.wifi_client_connected||$status_store.eth_connected==1?"has-text-primary":"has-text-danger"}" icon={$status_store.wifi_client_connected||$status_store.eth_connected==1?"fa6-solid:circle-check":"fa6-solid:circle-xmark"}></iconify-icon>
				</div>
			</div>
			<div class="my-1 container">
				<InputForm is_inline type="text" title={$_("config.network.host")} placeholder="openevse" bind:value={$config_store.hostname} 
					status={input_host_status} onChange={()=>onChange("hostname", $config_store.hostname)}/>
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
</Box>