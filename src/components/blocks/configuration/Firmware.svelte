<script>
	import { github_store }   	from "./../../../lib/stores/github.js";
	import { uistates_store } 	from "./../../../lib/stores/uistates.js";
	import { _ } 		  		from 'svelte-i18n'
	import { onMount } 			from "svelte";
	import {httpAPI,
			compareVersion} 	from "../../../lib/utils.js"
	import { serialQueue } 		from "../../../lib/queue.js";
	import {config_store} 		from "../../../lib/stores/config.js"
	import RemovableTag 	  	from "./../../ui/RemovableTag.svelte";
	import Borders 			  	from "./../../ui/Borders.svelte";
	import SelectFile 		  	from "./../../ui/SelectFile.svelte";
	import AlertBox 			from "./../../ui/AlertBox.svelte";
	import Box 					from "../../ui/Box.svelte"
	import Button 				from "../../ui/Button.svelte"
	import FirmwareUpdateModal 	from "./FirmwareUpdateModal.svelte"


	let restartEvseInst
	let restartEspInst
	let resetEspState = ""
	let fw_modal_opened = false
	let fw_has_update = false
	let fw = {name: undefined, version: undefined}
	let alert_visible = false
	let alert2_visible = false
	let export_link
	let export_butn
	let import_file
	let import_butn
	let firmware_release
	let firmware_prerelease
	let firmware_daily
	let mounted

	onMount(()=> {
		getFwUpdate()
		mounted = true
	})


	async function getFwUpdate() {
		if (!$github_store) {
			await github_store.download()
		}
		if ($github_store) {
			if (Object.keys($github_store).length) {
				firmware_release = $github_store.find(el => el.prerelease == false)
				firmware_prerelease = $github_store.find(el => el.prerelease == true &&
				(!isNaN(el.tag_name.charAt(1)) && el.tag_name.charAt(2) == "." && !isNaN(el.tag_name.charAt(3))))
				firmware_daily = $github_store.find(el => el.tag_name == "latest")
			}

			if (firmware_release && compareVersion(firmware_release.name,$config_store.version) == 1) {
				fw_has_update = true
				fw.version = firmware_release.name?firmware_release.name:""
			}
			else if (firmware_prerelease && compareVersion(firmware_prerelease.name,$config_store.version) == 1) {
				// test if pre-release is > installed version
				fw_has_update = true
				fw.version = firmware_prerelease.name?firmware_release.name:""
			}
			else fw_has_update = false
		}
	}

	async function restart(device) {
		let inst
		if (device == "gateway") {
			inst = restartEspInst
		} else if (device == "evse") {
			inst = restartEvseInst
		}
		inst.state = "loading"
		const payload = { device: device }
		let res = await serialQueue.add(()=>httpAPI("POST","/restart",JSON.stringify(payload)))
		if (res.msg == "restart " + device )  {
			inst.state = "ok"
			return true
		}
		else {
			inst.state = "error"
			return false
		}
	}

	async function resetESP(confirm=true) {
		if (confirm) {
			alert_visible = true
		}
		else {
			resetEspState = "loading"
			alert_visible = false
			let res = httpAPI("GET", "/reset")
			if (res) {
				alert2_visible = true
				resetEspState = "ok"
			}
			else {
				alert_visible = true
				resetEspState = "error"
			}
		}
	}

	async function exportConfig() {
		export_butn = "loading"
		// get latest config
		if (!await config_store.download()) {
			export_butn = "error"
			return
		}
		// copy config_store
		let conf = {...$config_store}
		// remove all credentials with _DUMMY_PASSWORD from file
		Object.keys(conf).forEach(element => {
			if(
				conf[element] == "_DUMMY_PASSWORD"  	||
				element == "www_username" 				||
				element == "ssid" 						||
				element == "mqtt_supported_protocols" 	||
				element == "http_supported_protocols"	||
				element == "firmware"					||
				element == "protocol"					||
				element == "espflash"					||
				element == "espinfo"					||
				element == "buildenv"					||
				element == "version"					||
				element == "evse_serial"				||
				element == "wifi_serial"
			) {
				delete conf[element]
			}
		});
		// create file
		const file = URL.createObjectURL(new Blob([JSON.stringify(conf,null,4)], { type: 'application/json' }))
		export_link.href =  file
		export_link.download = "config.json"
		export_butn = "ok"
		export_link.click()
		URL.revokeObjectURL(export_link.href);
	}

	async function importConfig() {
		import_butn = "loading"
		// let file = import_file.files[0]
		let reader = new FileReader();
 		reader.onload = async function() {
			let conf
			try {
				conf = JSON.parse(reader.result.toString())
			} catch (e) {
				console.log("Error parsing json")
				console.log(e)
				import_butn = "error"
				setTimeout(() => {
					import_file = null
				}, 2000);
				return false;
			}
			console.log(conf)
			let res
			if (await serialQueue.add(()=>config_store.upload(conf))) {
				import_butn = "ok"
			}
			else {
				console.log("Error uploading data")
				import_butn = "error"
			}
			setTimeout(() => {
					import_file = null
				}, 2000);
			if (import_butn == "error") {
				return false
			}
			else return true
		}
		reader.readAsText(import_file);
	}

</script>
<style>
	.version {
		max-width: 100px;
		word-wrap: break-word;
	}
</style>

{#if mounted}
<Box title={$_("config.titles.firmware")} icon="fa6-solid:microchip" back={true}>
	<table class="table is-fullwidth is-narrow has-text-dark">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white">{$_("config.firmware.hardware")}</th>
				<th class="has-text-white">{$_("config.firmware.version")}</th>
				<th class="has-text-white has-text-centered" >{$_("config.firmware.action")}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="has-text-weight-bold is-size-7-mobile">OpenEVSE</td>
				<td class="is-size-7-mobile">{$config_store.firmware}</td>
				<td><div class="has-text-centered"><Button bind:this={restartEvseInst} width="100px" size="is-responsive" name={$_("config.firmware.restart")} butn_submit={() => restart("evse")}/></div></td>
			</tr>
			<tr>
				<td class="has-text-weight-bold is-size-7-mobile">OpenEVSE Wifi</td>
				<td style="is-size-7-mobile">
					<div class="is-size-7-mobile {$uistates_store.breakpoint == "mobile" || $uistates_store.breakpoint == "mobilemini"?"version":""}">{$config_store.version}</div>
					{#if fw.version && compareVersion(fw.version, $config_store.version, )}
					<div class="tag is-primary is-small has-text-weight-bold">
						Latest stable: {fw.version}
					</div>
					{:else if fw.version}
					<div class="tag is-info is-small has-text-weight-bold">
						{$_("config.firmware.up2date")}
					</div>
					{/if}
				</td>
				<td>
					<div class="has-text-centered is-flex is-flex-direction-column">
						<div class="mb-2">
							<Button  size="is-responsive" width="100px"name={$_("config.firmware.update")} butn_submit={()=>fw_modal_opened=true} color="{fw.version && $config_store.version != fw.version?"is-primary":"is-info"}" />
						</div>
						<div class="mb-2">
							<Button bind:this={restartEspInst} size="is-responsive" width="100px" name={$_("config.firmware.restart")} butn_submit={() => restart("gateway")}/>
						</div>
						<div class="mb-2">
							<Button size="is-responsive" width="100px" name={$_("config.firmware.reset")} butn_submit={resetESP} state={resetEspState}/>
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="is-flex is-align-items-center is-justify-content-center px-6-tablet">
		<Borders grow>
			<div class="has-text-weight-bold has-text-dark mb-2">
				{$_("config.firmware.backup")}
			</div>
			<div class="mb-2">
				<div class="has-text-info has-text-weight-bold mb-1">
					{$_("config.firmware.backup-desc")}
				</div>
				<Button size="is-responsive" width="100px" state={export_butn} name={$_("config.firmware.export")} butn_submit={exportConfig}/>
				<div class="is-hidden">
					<a bind:this={export_link} href={null} >null</a>
				</div>
			</div>
			<div class=mb-2>
				{#if !import_file}
				<div>
					<SelectFile mini={true} width="100px" bind:file={import_file} ext=".json,.txt" title={$_("config.firmware.import")} />
				</div>

				{:else}
				<div>
					<Button size="is-responsive" color="is-primary" width="100px" state={import_butn} name={$_("config.firmware.upload")} butn_submit={importConfig} />
				</div>
				<div class="mt-2 is-inline-block">
					<RemovableTag
					action={()=> import_file = null}
					name={import_file.name}
				/>
				</div>
				{/if}
			</div>
		</Borders>
	</div>

</Box>
{#if fw_modal_opened}
<FirmwareUpdateModal bind:is_opened={fw_modal_opened} release={firmware_release} prerelease={firmware_prerelease} daily={firmware_daily} />
{/if}
<AlertBox title={$_("warning")} body={$_("config.firmware.reset-warning")} label={$_("config.firmware.reset")} button={true} action={()=>resetESP(false)} bind:visible={alert_visible}></AlertBox>
<AlertBox title={$_("warning")}  body={$_("config.firmware.reset-reboot")} bind:visible={alert2_visible}/>
{/if}