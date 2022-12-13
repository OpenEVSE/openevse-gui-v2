<script>
	import Loader from "./../../ui/Loader.svelte";
	import { serialQueue } from "./../../../lib/queue.js";
	import WifiIcon from "./../../ui/WifiIcon.svelte";
	import {removeDuplicateObjects, httpAPI} from "../../../lib/utils.js"
	import InputForm from "../../ui/InputForm.svelte"
	import Button from "../../ui/Button.svelte"
	import {onMount, onDestroy} from "svelte"
	export let active = false
	export let ssid = ""
	let key = ""
	let networks
	let timeout
	let state = ""
	let scanButnState = "default"

	onMount(() => {
		scanWifi()
	})
	onDestroy(() => {
		clearTimeout(timeout)
	})

	async function scanWifi() {
		state = "scan"
		scanButnState = "loading"
		networks = []
		let unfiltered_networks = await serialQueue.add(()=>httpAPI("GET","/scan"))
		if (unfiltered_networks.length < 1) {
			// scan again one time
			unfiltered_networks = await serialQueue.add(()=>httpAPI("GET","/scan"))
		}
		if (unfiltered_networks.length > 0) {
			scanButnState = "ok"
		}
		else scanButnState = "error"
		networks = removeDuplicateObjects(unfiltered_networks,"ssid")
		state = ""

		return networks
	}
	async function connectWifi() {
		let param = "ssid=" + ssid + "&pass=" + key
		let response = await serialQueue.add(()=>httpAPI("POST", "/savenetwork", param, "text"))
		active = false
		return true
	}

	function scanAgain() {
		scanWifi()
		// networks = []

		return "Scanning ..."
	}

</script>

<style>
		.nopointer {
            cursor: default;
        }

		.cellbutton {
			background: transparent;
			border: none !important;
			width: 100%;
			height: 100%;
		}
		.cellbutton:hover {
			background: white;
		}

		table {
			height:100%;
		}
</style>
<div>
	<table class="table is-hoverable has-text-centered is-fullwidth is-bordered is-size-7 mb-3">
		<thead>
			<tr class="has-background-info ">
				<th class="has-text-white has-text-centered" style="width: 70%;">SSID</th>
				<th class="has-text-white has-text-centered">Signal</th>
			</tr>
		</thead>
		<tbody>
				{#if networks && networks.length > 0}
					{#each networks as network}
						<tr class="has-background-light">
							<td class="m-0 p-0"><button class=" is-clickable cellbutton has-text-weight-semibold" on:click={()=> {ssid=network.ssid}}>{network.ssid}</button></td>
							<td class="pt-2 no-pointer has-tooltip-arrow has-tooltip-top nopointer" data-tooltip={network.rssi + " dBm"}>
								<WifiIcon dbm={network.rssi}/>
							</td>
						</tr>
					{/each}
				{:else if state == "scan"}
				<tr class="has-background-light">
					<th class="has-text-centered is-vcentered">Scanning Networks</th>
					<td class="has-text-info is-size-6"><Loader width="20" /></td>
				</tr>
				{:else}
					<tr class="has-background-light">
						<th class="has-text-centered is-vcentered">No network found, scan again</th>
						<td class="has-text-info is-size-6"></td>
					</tr>
				{/if}
		</tbody>

	</table>
</div>
<form>
<InputForm type="text" title="SSID" placeholder="WiFi SSID" bind:value={ssid} />
<InputForm type="password" title="WiFi Password" placeholder="WPA Key" bind:value={key} />
<div class="is-flex is-align-items-center">
	<Button name="Connect" color="is-primary" butn_submit={connectWifi} disabled={ssid =="" || key == ""?true:false}/>
	<Button name="Scan" butn_submit={scanAgain} bind:state={scanButnState}/>
	<Button name="Cancel" color="is-danger" butn_submit={() => active = false}/>
</div>

</form>
