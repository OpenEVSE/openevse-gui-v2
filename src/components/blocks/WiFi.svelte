<script>
import {status_store} from '../../lib/stores/status.js'
import {config_store} from "../../lib/stores/config.js"
import Fa from 'svelte-fa/src/fa.svelte'
import { faCircleCheck, faCircleXmark} from '@fortawesome/free-solid-svg-icons/index.js'
import {httpAPI} from "../../lib/api.js"

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
let networks

function selectWifi() {
	selectSSID = true
}
function connectWifi() {
	selectSSID = false
}

async function scanWifi() {
	networks = await httpAPI("GET","/scan")
	if (networks.length == 0) {
		//error no results
		setTimeout(async () => networks = await httpAPI("GET","/scan"),3000)
		return 0
	}
	return networks
}

function scanAgain() {
	selectSSID = false
	networks = null
	setTimeout(() => selectSSID = true,0)
	return "Scanning ..."
}


</script>
<style>
		.box {
			max-width : 600px;
			min-width: 300px;
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
							<tr class="has-background-info ">
							<th class="has-text-white has-text-centered">Network</th>
							<th class="has-text-white has-text-centered">RSSI dBm</th>
							</tr>
						</thead>
						<tbody>
							<tr class="has-background-light">
								<th>{$config_store.ssid}</th>
								<td>{$status_store.srssi}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<button class="button is-info is-outlined mt-2" on:click={selectWifi}>Scan WiFi Network</button>
				{:else}
					{#await scanWifi()}
					<span>Scanning networks...</span>
					{:then}
					<div>
						<table class="table has-text-centered is-fullwidth is-bordered is-hoverable is-size-7">
							<thead>
								<tr class="has-background-info ">
								<th class="has-text-white has-text-centered">Network</th>
								<th class="has-text-white has-text-centered">RSSI dBm</th>
								<th class="has-text-white has-text-centered">Channel</th>
								<th class="has-text-white has-text-centered">BSSID</th>
								</tr>
							</thead>
							<tbody>
								{#if networks.length > 0}
									{#each networks as network}
									<tr class="is-clickable" on:click={()=> {ssid=network.ssid}}>
										<th>{network.ssid}</th>
										<td>{network.rssi}</td>
										<td>{network.channel}</td>
										<td>{network.bssid}</td>
									</tr>
									{/each}
								{:else}
									<!-- No Network found, scan again -->
									<div>No network found, scan again</div>
								{/if}
							</tbody>
						</table>
					</div>
					<div>
						<span class="has-text-weight-bold">SSID</span>
						<input class="input is-info" type="text" placeholder="SSID" value={ssid} />
					</div>
					<div>
						<span class="has-text-weight-bold">Key</span>
						<input class="input is-info" type="text" placeholder="WiFi Key" value={key} />
					</div>
					<button class="button is-primary is-outlined mt-2" on:click={connectWifi}>Connect</button>
					<button class="button is-info is-outlined my-2" on:click={scanAgain}>Scan Again</button>
					<button class="button is-info is-outlined my-2" on:click={() => selectSSID = false}>Cancel</button>
					{/await}
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