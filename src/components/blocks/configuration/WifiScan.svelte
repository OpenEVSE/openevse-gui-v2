<script>
	import { status_store } 				 from "./../../../lib/stores/status.js";
	import { uistates_store } 				 from "./../../../lib/stores/uistates.js";
	import { _ } 		  					 from 'svelte-i18n'
	import { config_store } 				 from "./../../../lib/stores/config.js";
	import {onMount, onDestroy} 			 from "svelte"
	import {removeDuplicateObjects, httpAPI} from "../../../lib/utils.js"
	import { serialQueue } 					 from "./../../../lib/queue.js";
	import WifiIcon 						 from "./../../ui/WifiIcon.svelte";
	import InputForm 						 from "../../ui/InputForm.svelte"
	import Button 							 from "../../ui/Button.svelte"
	import Borders 							 from "./../../ui/Borders.svelte";

	export let active = false
	export let ssid = ""
	// export let is_wizard = false
	let scan_cnt = 0
	let key = ""
	let timeout
	let state = ""
	let scanButnState = ""
	let connectButnState = ""
	let networks

	onMount(() => {
		// scanWifi()
		asyncWifiScan(true)
	})
	onDestroy(() => {
		if (timeout)
			clearTimeout(timeout)
	})

	async function handleWifiScan() {
		let unfiltered_networks
		unfiltered_networks = await serialQueue.add(()=>httpAPI("GET","/scan"))
		if (unfiltered_networks == "error") {
			return false
		}
		else {
			if (unfiltered_networks.length) {
			networks = removeDuplicateObjects(unfiltered_networks,"ssid")
			}
			else networks = []
			return true
		}
	}

	async function asyncWifiScan(auto = false) {
		if(auto == true && $uistates_store.networks.length > 0)
			return
			state = "scan"
			scanButnState = "loading"
		if (await handleWifiScan()) {
			// success
			$uistates_store.networks = networks
			state = ""
			scanButnState = "ok"
			scan_cnt = 0
		}
		else {
			// got http 500
			state = ""
			scanButnState = "error"
			scan_cnt = 0
		}
	}

	async function connectWifi() {
		let param = {
			ssid: ssid,
			pass: key
		}
		connectButnState = "loading"
		let response = await serialQueue.add(()=>config_store.upload(param))
		if (!response) {
			connectButnState = "error"
		}
		else {
			connectButnState = "ok"
			active = false
		}
		$uistates_store.alertbox.visible = true
		$uistates_store.alertbox.title = $_("notification")
		$uistates_store.alertbox.body = $_("config.network.connecting")
		$uistates_store.alertbox.closable = false
		let ip = $status_store.ipaddress
		setTimeout(() => {
			if ($status_store.net_connected) {
				$uistates_store.alertbox.visible = true
				$uistates_store.alertbox.title = $_("error")
				$uistates_store.alertbox.body = $_("config.network.con-failed") + $config_store.ssid
				$uistates_store.alertbox.closable = true
			}
		}, 20000);
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
			height:fit-content;
		}
</style>
<Borders grow>
	<form on:submit|preventDefault>
		<div class=" ">
			
				<div class="">
					<InputForm type="text" is_inline title={$_("config.network.ssid")} placeholder={$_("config.network.ssid-desc")} bind:value={ssid} />
				<div class="">
					<InputForm type="password" is_inline title={$_("config.network.pass")} placeholder={$_("config.network.pass-desc")} bind:value={key} />
				</div>
				<div class="is-flex is-align-items-center is-justify-content-center">
					<Button name={$_("config.network.connect")} color="is-primary" bind:state={connectButnState} butn_submit={connectWifi} disabled={ssid =="" || key == ""?true:false}/>
					
					{#if $config_store.ssid}
					<Button name={$_("cancel")} color="is-danger" butn_submit={() => active = false}/>
					{/if}
					<div class="my-2 has-text-centered">
						<Button name={$_("config.network.scan")} butn_submit={asyncWifiScan} bind:state={scanButnState} disabled={state == "scan"}/>
					</div>
				</div>
		</div>
	</form>
	
	<div class="">
		<table class="table is-hoverable has-text-centered is-fullwidth is-bordered is-size-7 mb-3">
			<thead>
				<tr class="has-background-info ">
					<th class="has-text-white has-text-centered">{$_("config.network.ssid")}</th>
					<th class="has-text-white has-text-centered">{$_("config.network.signal")}</th>
				</tr>
			</thead>
			<tbody>
					{#if $uistates_store.networks && $uistates_store.networks.length > 0}
						{#each $uistates_store.networks as network}
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
						<td class="has-text-info is-size-6"></td>
					</tr>
					{:else}
						<tr class="has-background-light">
							<th class="has-text-centered is-vcentered has-text-weight-semibold">{$_("config.network.failed")}</th>
							<td class="has-text-info is-size-6"></td>
						</tr>
					{/if}
			</tbody>

		</table>
	</div>
</Borders>