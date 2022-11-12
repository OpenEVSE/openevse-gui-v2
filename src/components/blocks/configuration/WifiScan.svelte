<script>
	import {dbm2icon, removeDuplicateObjects, httpAPI} from "../../../lib/utils.js"
	import InlineSVG from 'svelte-inline-svg'
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faSpinner} from '@fortawesome/free-solid-svg-icons/index.js'
	import InputForm from "../../ui/InputForm.svelte"
	import {onMount, onDestroy} from "svelte"
	export let active = false
	export let ssid = ""
	let key = ""
	let networks
	let timeout
	let state = ""

	onMount(() => {
		scanWifi()
	})
	onDestroy(() => {
		clearTimeout(timeout)
	})

	async function scanWifi() {
		state = "scan"
		networks = []
		let unfiltered_networks = await httpAPI("GET","/scan")
		networks = removeDuplicateObjects(unfiltered_networks,"ssid")
		state = ""
		return networks
	}
	async function connectWifi() {
		let param = "ssid=" + ssid + "&pass=" + key
		let response = await httpAPI("POST", "/savenetwork", param, "text")
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
								<InlineSVG src={dbm2icon(network.rssi)} {...{width: 24, height: 24}} />
							</td>
						</tr>
					{/each}
				{:else if state == "scan"}
				<tr class="has-background-light">
					<th class="py-3 has-text-centered">Scanning Networks</th>
					<td class="py-3 has-text-info is-size-6"><Fa icon={faSpinner} spin /></td>
				</tr>
				{:else}
					<tr class="has-background-light">
						<th class="py-3 has-text-centered">No network found, scan again</th>
						<td class="py-3 has-text-info is-size-6"></td>
					</tr>
				{/if}
		</tbody>
		
	</table>
</div>
<form>
<InputForm type="text" title="SSID" placeholder="WiFi SSID" bind:value={ssid} />
<InputForm type="password" title="WiFi Password" placeholder="WPA Key" bind:value={key} />
<button class="button is-primary is-outlined mt-2" disabled={ssid =="" || key == ""?true:false} on:click|preventDefault={connectWifi}>Connect</button>
</form>

<button class="button is-info is-outlined my-2" on:click={scanAgain}>Scan Again</button>
<button class="button is-danger is-outlined my-2" on:click={() => active = false}>Cancel</button>