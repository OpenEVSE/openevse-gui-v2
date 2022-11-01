<script>
import {status_store} from '../../lib/stores/status.js'
import {config_store} from "../../lib/stores/config.js"
import Fa from 'svelte-fa/src/fa.svelte'
import { faCircleCheck, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons/index.js'
import {httpAPI, removeDuplicateObjects} from "../../lib/utils.js"
import wifisignal1 from '../../assets/wifi_signal_1.svg';
import wifisignal2 from '../../assets/wifi_signal_2.svg';
import wifisignal3 from '../../assets/wifi_signal_3.svg';
import wifisignal4 from '../../assets/wifi_signal_4.svg';
import wifisignal5 from '../../assets/wifi_signal_5.svg';

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

let selectSSID = false
let ssid = ""
let key = ""
let showkey = false
let networks

function selectWifi() {
	selectSSID = true
}
async function connectWifi() {
	selectSSID = false
	let param = "ssid=" + ssid + "&pass=" + key
	let response = await httpAPI("POST", "/savenetwork", param, "text")
	if (response == "saved") {
		return true
	}
	else return false
}

async function scanWifi() {
	let unfiltered_networks = await httpAPI("GET","/scan")
	networks = removeDuplicateObjects(unfiltered_networks,"ssid")
	return networks
}

function scanAgain() {
	selectSSID = false
	networks = null
	setTimeout(() => selectSSID = true,0)
	return "Scanning ..."
}

function inputKey(event) {
	key = event.target.value
}

function dbm2icon(dbm) {
	let icon
	if (dbm <= -80) icon = wifisignal1
	else if (dbm > -80 && dbm <= -75) icon = wifisignal2
	else if (dbm > -75 && dbm <= -70) icon = wifisignal3
	else if (dbm > -70 && dbm <= -65) icon = wifisignal4
	else if (dbm > -65) icon = wifisignal5
	return icon
}


$: type = showkey ? "text" : "password"
</script>
<style>
		.box {
			max-width : 600px;
			min-width: 300px;
		}

		.networks :hover {
			background-color: white;
		}
		.networks :focus {
			background-color: white;
		}

		.nohover {
			pointer-events: none;
		}

		.cellbutton {
			background: transparent;
			border: none !important;
			width: 100%;
			height: 100%;
		}
		table {
			height:100%;
		}
</style>

<div class="box is-flex-grow-1 is-flex-shrink-0">
	<div class="has-text-weight-bold is-size-5 mb-5">WiFi Setup</div>
	<span class="is-size-6 has-text-weight-bold">
		 	Mode: 
	</span>
	<span>{displayMode($status_store.mode)}</span>
	<div class="my-3">
				{#if selectSSID == false}
				<div>
					<table class="table has-text-centered is-fullwidth is-bordered is-size-7">
						<thead>
							<tr class="has-background-info">
							<th class="has-text-white has-text-centered" style="width: 70%;">SSID</th>
							<th class="has-text-white has-text-centered">RSSI dBm</th>
							</tr>
						</thead>
						<tbody>
							<tr class="has-background-light">
								<th class="has-text-centered">{$config_store.ssid}</th>
								<td class="has-text-centered"><img width="24px" height="24px" alt="dssdsd" src={dbm2icon($status_store.srssi)}/></td>
							</tr>
						</tbody>
					</table>
				</div>
				<button class="button is-info is-outlined mt-2" on:click={selectWifi}>Change WiFi Network</button>
				{:else}
					
					<div>
						<table class="table is-hoverable has-text-centered is-fullwidth is-bordered is-size-7 mb-3">
							<thead>
								<tr class="has-background-info ">
									<th class="has-text-white has-text-centered" style="width: 70%;">SSID</th>
									<th class="has-text-white has-text-centered">Signal</th>
								</tr>
							</thead>
							<tbody>
								{#await scanWifi()}
									<tr class="has-background-light">
									<th class="has-text-centered">Scanning Networks</th>
									<td><Fa icon={faSpinner} spin /></td>
									</tr>
								{:then}
									{#if networks.length > 0}
										{#each networks as network}
											<tr class="has-background-light networks" on:click={()=> {ssid=network.ssid}}>
												<td class="m-0 p-0"><button class=" is-clickable cellbutton has-text-weight-semibold">{network.ssid}</button></td>
												<td class="nohover">
													<img width="24px" height="24px" alt="dssdsd" src={dbm2icon(network.rssi)}/>
												</td>
											</tr>
										{/each}
									{:else}
										<!-- No Network found, scan again -->
										<tr>No network found, scan again</tr>
									{/if}
								{/await}
							</tbody>
							
						</table>
					</div>
					<div class="block">
						<span class="has-text-weight-bold">SSID</span>
						<input class="input is-info" type="text" placeholder="SSID" bind:value={ssid} />
					</div>
					<div class="block">
						<span class="has-text-weight-bold">Password</span>
						<input class="input is-info" {type} placeholder="WiFi Password" value={key} on:input={inputKey}/>
						<div class="my-2">
							<label class="checkbox">
								<input type="checkbox" bind:checked={showkey}>
								Show
							</label>
						</div>
					</div>
					
					<button class="button is-primary is-outlined mt-2" disabled={ssid =="" || key == ""?true:false} on:click={connectWifi}>Connect</button>
					<button class="button is-info is-outlined my-2" on:click={scanAgain}>Scan Again</button>
					<button class="button is-danger is-outlined my-2" on:click={() => selectSSID = false}>Cancel</button>
					
				{/if}
	</div>
	<div>
		<span class="has-text-weight-bold is-size-6">IP adress: </span><span>{$status_store.ipaddress}</span>
	</div>
	<div class="is-align-items-center">
		<span class="has-text-weight-bold is-size-6">Connected: </span>
			<Fa class="pt-1 ml-2 is-size-5 {$status_store.net_connected==1?"has-text-primary":"has-text-danger"}" icon={$status_store.net_connected==1?faCircleCheck:faCircleXmark} />
	</div>
</div>