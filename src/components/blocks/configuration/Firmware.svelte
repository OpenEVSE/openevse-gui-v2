<script>
	import { onMount } 			from "svelte";
	import {httpAPI} 			from "../../../lib/utils.js"
	import { serialQueue } 		from "../../../lib/queue.js";
	import {config_store} 		from "../../../lib/stores/config.js"
	import Box 					from "../../ui/Box.svelte"
	import Button 				from "../../ui/Button.svelte"
	import FirmwareUpdateModal 	from "./FirmwareUpdateModal.svelte"
	import 'iconify-icon';

	let restartOpenEvseState = "default"
	let restartEspState = "default"
	let fw_modal_opened = false
	let modal
	let fw_has_update = false
	let url = "https://api.github.com/repos/OpenEVSE/ESP32_WiFi_V4.x/releases/latest"
	let fw = {name: undefined, version: undefined, url: undefined}

	onMount(()=>getFwUpdate())


	async function getFwUpdate() {
		let fw_update_json = await httpAPI("GET",url)
		if (fw_update_json != "error") {
			fw.version = fw_update_json.tag_name
			fw.name = $config_store.buildenv + ".bin"
			fw.html_url = fw_update_json.html_url
			let item = fw_update_json.assets.find(obj => {
					return obj.name === fw.name
				})
			fw.url = item.browser_download_url
			if (fw.version != $config_store.version) {
				fw_has_update = true
			}
			
		}

	}
	
	async function restartOpenEvse() {
		restartOpenEvseState = "loading"
		const payload = "json=1&rapi=$FR"
		let res = await serialQueue.add(()=>httpAPI("POST","/r",payload, "text"))
		if (res == "set" )  {
			restartOpenEvseState = "ok"
			return true
		}
		else {
			// cheating as openEVSE api always answer HTTP 500 on reboot command
			restartOpenEvseState = "ok"
			return false
		}
	}

	async function restartESP() {
		restartEspState = "loading"
		let res = await serialQueue.add(()=>httpAPI("POST","/restart",null,"text"))
		if (res == "1" )  {
			restartEspState = "ok"
			return true
		}
		else {
			restartEspState = "error"
			return false
		}
	}


</script>


<Box title="Firmware" icon="fa6-solid:microchip">
	<table class="table is-fullwidth is-vcentered is-narrow">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white ">Hardware</th>
				<th class="has-text-white">Version</th>
				<th class="has-text-white has-text-centered " >Action</th>
			</tr>
		</thead>
		<tbody class="is-size-7-mobile">
			<tr>
				<td class="has-text-weight-bold">OpenEVSE</td>
				<td>{$config_store.firmware}</td>
				<td><div class="has-text-centered"><Button width="80px" size="is-small" name="Restart" butn_submit={restartOpenEvse} state={restartOpenEvseState}/></div></td>
			</tr>
			<tr>
				<td class="has-text-weight-bold">OpenEVSE Wifi</td>
				<td>
					<div>{$config_store.version}</div>
					{#if fw.version && $config_store.version != fw.version}
					<div class="tag is-primary is-small has-text-weight-bold">
						Update<div class="is-hidden-mobile">&nbsp;Available</div>
					</div>
					{:else if fw.version && $config_store.version == fw.version}
					<div class="tag is-info is-small has-text-weight-bold">
						Up to date
					</div>
					{/if}
				</td>
				<td>
					<div class="has-text-centered ">
						<div class="mb-2">
							<Button width="80px" size="is-small" name="Restart" butn_submit={restartESP} state={restartEspState}/>
						</div>
						<div class="mb-2">
							<Button bind:this={modal} width="80px" size="is-small" name="Update" butn_submit={()=>fw_modal_opened=true} color="{fw.version && $config_store.version != fw.version?"is-primary":"is-info"}" />
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</Box>
{#if fw_modal_opened}
<FirmwareUpdateModal bind:is_opened={fw_modal_opened} update={fw} />
{/if}