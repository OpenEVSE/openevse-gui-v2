<script>
	import Switch from "./../../ui/Switch.svelte";
	import RemovableTag from "./../../ui/RemovableTag.svelte";
	import { _ } 		  		from 'svelte-i18n'
	import { config_store } 	from "./../../../lib/stores/config.js";
	import { serialQueue }		from "./../../../lib/queue.js";
	import { status_store } 	from "../../../lib/stores/status.js"
	import {httpAPI}			from "../../../lib/utils.js" 
	import {onDestroy, onMount} from "svelte"
	import Box 					from "../../ui/Box.svelte"
	import Button 				from "../../ui/Button.svelte"
	import Modal 				from "../../ui/Modal.svelte"
	import SelectFile 			from "../../ui/SelectFile.svelte"
	import ProgressBar			from "../../ui/ProgressBar.svelte";
	
	
	export let is_opened = false
	export let release = {}
	export let daily = {}
	let update = {}

	let file
	let http_update = false
	let uploadButtonState = ""
	let gitUpdateButtonState = ""
	let fileSent = "no"
	let timeout
	let canClose = true
	let confirmed = false
	let useDailyBuild = false
	let mounted = false

	onDestroy(() => {
		clearTimeout(timeout)
	})

	onMount(()=> {
		mounted = true
	})	

	
	const uploadFiles = (url, file) =>
		new Promise((resolve, reject) => {
			if (import.meta.env.DEV) { 
				url = "/api" + url
			}
			const xhr = new XMLHttpRequest();
			xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }));
			xhr.addEventListener('error', () => reject(new Error('File upload failed')));
			xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
			xhr.open('POST', url, true);
			const formData = new FormData();
			formData.set("update", file);
			xhr.send(formData);
  		});

	let updateToLatest = async (url) => {
		const data = {
			url: url
		}
		$status_store.ota_progress = 0
		http_update = true
		gitUpdateButtonState = "loading"
		let res = await serialQueue.add(()=>httpAPI("POST","/update",JSON.stringify(data)))
		if (!res) {
			gitUpdateButtonState = "error"
			http_update = false
		}
		confirmed = false
	}


	async function uploadFw() {
		// Prevent UI to send any request while OTA is in progress
		if (file) {
			serialQueue.pause()
			$status_store.ota_progress = 0
			canClose = false;
			uploadButtonState = "loading"
			const response = await uploadFiles('/update', file)
			if (response.status >= 400) {
				console.log("Upload Error (HTTP" + response.status + ")")
				uploadButtonState = "error"
				fileSent = "ko"
			}
			else {
				uploadButtonState = "ok"
				fileSent = "ok"
			}
			serialQueue.resume()
		}
	}

	function displayOta() {
		if ($status_store.ota == "started") {
			if (http_update) {
				gitUpdateButtonState = "loading"
			}
			else {
				uploadButtonState = "loading"
			}
		}
		else if ($status_store.ota == "completed") {
			if (http_update)
				gitUpdateButtonState = "ok"
			else
				uploadButtonState = "ok"
			canClose = true
			$status_store.ota_progress = 0
			file = null
			timeout = setTimeout(()=> location.reload(),6000)
		}
		else if ($status_store.ota == "failed") {
			if (http_update)
				gitUpdateButtonState = "error"
			else {
				uploadButtonState = "error"
			}
			http_update = false
			$status_store.ota_progress = 0
			canClose = true
			timeout = setTimeout(()=> $status_store.ota = "",3000)
		}
	}

	function switchBuilds(is_dev) {
		let github_upd
		if (!is_dev) {
			// use stable release
			github_upd = release
		}
		else {
			github_upd = daily
		}
		console.log(github_upd)
		// {name: undefined, version: undefined, url: undefined}

		update.version = github_upd.name
		if (github_upd.tag_name == "v2_gui")
			update.name = $config_store.buildenv + "_gui-v2" + ".bin"
		else update.name = $config_store.buildenv + ".bin"
		console.log(update.name)
		update.html_url = github_upd.html_url
		let item = github_upd.assets.find(obj => {
			return obj.name === update.name
		})
		update.updated_at = item.updated_at
		update.url = item.browser_download_url
		console.log(update.url)
	}

	$: $status_store.ota,displayOta()
	$: switchBuilds(useDailyBuild)


</script>

<style>

</style>

{#if mounted}
<Modal bind:is_opened {canClose}>
	<Box title={$_("config.titles.firmware-update")} icon="fa6-solid:microchip">
		<div class="pt-2">
			
			<div class="">
				<table class="table is-fullwidth is-vcentered has-text-dark">
					<tbody class="is-size-6">
						<tr>
							<td class="has-text-weight-semibold" width="15%">{$_("config.firmware.espinfo")}</td>
							<td class="">{$config_store.espinfo}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold">{$_("config.firmware.build")}</td>
							<td class="">{$config_store.buildenv}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold">{$_("config.firmware.installed")}</td>
							<td class="">{$config_store.version}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold pt-3">
								<div class="is-flex is-align-items-center">
									<span class="">{$_("config.firmware.latest")}</span>
									<a href={update.html_url} target="_blank" rel="noreferrer" class="has-text-dark is-flex is-align-items-center ml-2">
										<iconify-icon inline icon="icon-park-outline:github" class="is-size-4"></iconify-icon>
									</a>
								</div>
								
							</td>
							<td class="">
								<div class="is-flex is-align-items-center  is-flex-wrap-wrap">
									<div class="is-inline-block">
										<div class="is-size-6 has-text-weight-bold">{update.version} </div>
										<div class="is-size-7">{update.updated_at}</div>
									</div>
									<div class="ml-4">
										{#key update.version}
										{#if !confirmed}
										<div class="mb-2">
											
											<Button 
											size="is-responsive" 
											icon="fa6-solid:cloud-arrow-down" 
											tooltip={$_("config.firmware.gh-install")}
											disabled={uploadButtonState == "loading" || gitUpdateButtonState == "loading"} 
											name={update.version}
											color="{$config_store.version != update.version ?"is-primary":"is-info	"}" 
											butn_submit={()=>{confirmed=true}}

											/>
										</div>
										
										{:else}
										<div class="is-flex is-justify-content-center is-align-items-baseline is-flex-wrap-wrap is-inline-block">
											<Button 
												size="is-responsive mb-2" 
												disabled={gitUpdateButtonState == "loading"} 
												name={$_("config.firmware.confirm")}
												color="{$config_store.version != update.version ?"is-primary":"is-info	"}" 
												butn_submit={()=>{updateToLatest(update.url)}}
											/>
											<Button 
												size="is-responsive mb-2" 
												disabled={gitUpdateButtonState == "loading"} 
												name="{$_("cancel")}"
												color="{"is-danger"}" 
												butn_submit={()=>{confirmed=false}}
											/>
										</div>

										{/if}
										{/key}
									</div>
								</div>
								
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		
		<div>
			<Switch 
				name="switchdev" 
				label="Daily Build" 
				bind:checked={useDailyBuild}
			/>
		</div>
		{#if file || http_update}	
		<div class="my-2 is-size-6 is-flex is-justify-content-center ">
			<div class="is-flex-shrink-0 is-flex-grow-1">
				{#if $status_store.ota == "started" || $status_store.ota_progress > 0}
				{$_("config.firmware.progress")}
				<div class="is-flex-shrink-0 is-flex-grow-1 is-flex is-justify-content-center" >
					<ProgressBar value={$status_store.ota_progress} />
				</div>
				{:else if $status_store.ota == "failed" }
				{$_("config.firmware.failed")}
				{:else if $status_store.ota == "completed" }
				{$_("config.firmware.complete")}
				{:else}
				<div class="is-flex is-justify-content-center mb-2">
						<RemovableTag
							action={()=> file = null}
							name={http_update?update.name:file.name}
						/>
				</div>
				{/if}
			</div>
		</div>
		<div class="is-flex is-align-items-center is-justify-content-center">
			<Button 
				disabled={uploadButtonState == "loading" || gitUpdateButtonState == "loading"} 
				name={$_("config.firmware.upload")}
				state={uploadButtonState}
				icon="fa6-solid:file-arrow-up" 
				color="is-info" 
				butn_submit={uploadFw}
			/>
			<Button disabled={uploadButtonState == "loading" || gitUpdateButtonState == "loading"} name={$_("close")} color="is-danger" butn_submit={()=>is_opened=false} />
		</div>
		{:else}
		<div class="is-flex is-align-items-center is-justify-content-center my-2 is-size-6">
			{$_("config.firmware.nofile")}
		</div>
		<div class="is-flex is-align-items-center is-justify-content-center">
			<SelectFile bind:file={file} ext=".bin,.hex" icon="fa6-solid:file-export"/>&nbsp;
			<Button disabled={uploadButtonState == "loading" || fileSent == "ok"} name={$_("close")} color="is-danger" butn_submit={()=>is_opened=false} />
		</div>
		{/if}
	</Box>
</Modal>
{/if}