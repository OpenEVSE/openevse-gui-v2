<script>
	import { _ } 		  					 from 'svelte-i18n'
	import { uistates_store } 				 from "./../../../lib/stores/uistates.js";
	import { config_store } 				 from "./../../../lib/stores/config.js";
	import {onMount, onDestroy} 			 from "svelte"
	import {removeDuplicateObjects, httpAPI} from "../../../lib/utils.js"
	import { serialQueue } 					 from "./../../../lib/queue.js";
	import Loader 							 from "./../../ui/Loader.svelte";
	import WifiIcon 						 from "./../../ui/WifiIcon.svelte";
	import InputForm 						 from "../../ui/InputForm.svelte"
	import Button 							 from "../../ui/Button.svelte"

	export let active = false
	export let ssid = ""
	export let is_wizard = false

	let key = ""
	let networks
	let timeout
	let state = ""
	let scanButnState = ""

	onMount(() => {
		scanWifi()
	})
	onDestroy(() => {
		if (timeout)
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
		setTimeout(()=> { 
					console.log("redirecting url")
					let url = ""
					if (!import.meta.env.DEV) {
						url = "http://" + $config_store.hostname + ".local"
					}
					if (is_wizard) {
						$uistates_store.wizard_step = 3
						url = url +  "/#/wizard/" + $uistates_store.wizard_step
					}
					
					location.replace(url) }
				, 4000 )
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
				<th class="has-text-white has-text-centered" style="width: 70%;">{$_("config.network.ssid")}</th>
				<th class="has-text-white has-text-centered">{$_("config.network.signal")}</th>
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
					<td class="has-text-centered is-vcentered has-text-weight-semibold">{$_("config.network.scanning")}</td>
					<td class="has-text-info is-size-5"><Loader /></td>
				</tr>
				{:else}
					<tr class="has-background-light">
						<th class="has-text-centered is-vcentered has-text-weight-semibold">{$_("config.network.failed")}</th>
						<td class="has-text-info is-size-6"></td>
					</tr>
				{/if}
		</tbody>

	</table>


	<form on:submit|preventDefault>
		<div class="is-flex is-flex-direction-column is-justify-content-center">
			<div class="container">
				<InputForm type="text" title={$_("config.network.ssid")} placeholder={$_("config.network.ssid-desc")} bind:value={ssid} />
				<InputForm type="password" title={$_("config.network.pass")} placeholder={$_("config.network.pass-desc")} bind:value={key} />
			</div>
			
			
		</div>
			
			<div class="is-flex is-align-items-center is-justify-content-center">
				<Button name={$_("config.network.connect")} color="is-primary" butn_submit={connectWifi} disabled={ssid =="" || key == ""?true:false}/>
				<Button name={$_("config.network.scan")} butn_submit={scanAgain} bind:state={scanButnState}/>
				{#if $config_store.ssid}
				<Button name={$_("cancel")} color="is-danger" butn_submit={() => active = false}/>
				{/if}
			</div>
	</form>
</div>

