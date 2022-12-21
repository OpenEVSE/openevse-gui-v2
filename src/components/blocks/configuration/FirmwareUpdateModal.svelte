<script>
	import { config_store } 	from "./../../../lib/stores/config.js";
	import { serialQueue }		from "./../../../lib/queue.js";
	import { status_store } 	from "../../../lib/stores/status.js"
	import {httpAPI, round}			from "../../../lib/utils.js" 
	import {onDestroy, onMount} from "svelte"
	import Box 					from "../../ui/Box.svelte"
	import Button 				from "../../ui/Button.svelte"
	import IconButton 			from "../../ui/IconButton.svelte"
	import Modal 				from "../../ui/Modal.svelte"
	import SelectFile 			from "../../ui/SelectFile.svelte"
	import ProgressBar			from "./../../ProgressBar.svelte";
	import 'iconify-icon';
	
	export let is_opened = false
	export let update = {}

	let file
	let uploadButtonState = "default"
	let fileSent = "no"
	let timeout
	let canClose = true

	onDestroy(() => {
		clearTimeout(timeout)
	})

	onMount(()=> {
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
		uploadButtonState = "loading"
		await httpAPI("POST","/update",JSON.stringify(data))
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
			if (uploadButtonState != "loading")
				uploadButtonState = "loading"
			console.log("ota: " + $status_store.ota_progress)
		}
		else if ($status_store.ota == "completed") {
			uploadButtonState = "ok"
			canClose = true
			timeout = setTimeout(()=> location.reload(),6000)
		}
		else if ($status_store.ota == "failed") {
			uploadButtonState = "error"
			canClose = true
			timeout = setTimeout(()=> $status_store.ota = "",3000)
		}
	}

	$: $status_store.ota,displayOta()


</script>

<style>

</style>

<Modal bind:is_opened {canClose}>
	<Box title="Firmware Update" icon="fa6-solid:microchip">
		<div class="pt-2">
			
			<div class="">
				<table class="table is-fullwidth is-vcentered">
					<thead>
						
						<tr class="has-background-info has-text-white py-1"	>
							<th colspan=2 class="has-text-white py-1">Current Firmware</th>
						</tr>
					</thead>
					<tbody class="is-size-6">
						<tr>
							<td class="has-text-weight-semibold">ESP info</td>
							<td class="">{$config_store.espinfo}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold">Build</td>
							<td class="">{$config_store.buildenv}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold">Installed</td>
							<td class="has-text-info">{$config_store.version}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold">
								<div class="is-flex is-align-items-center">
									Latest
									<a href={update.html_url} target="_blank" rel="noreferrer" class="has-text-black ml-2">
										<iconify-icon icon="mdi:github" class="is-size-4 mt-2"></iconify-icon>
									</a>
								</div>
								
							</td>
							<td class="">
								<div class="is-flex is-align-items-center is-flex-direction-row is-flex-wrap-wrap ">
									<span class="mr-2 is-underlined"><a href={update.url} class="{$config_store.version != update.version ?"has-text-primary":"has-text-info"}">{update.version}</a></span>
									
									<Button size="is-small" icon="fa6-solid:cloud-arrow-down" disabled={uploadButtonState == "loading"} name="Upgrade to {update.version}" color="{$config_store.version != update.version ?"is-primary":"is-info	"}" butn_submit={()=>{updateToLatest(update.url)}} state={uploadButtonState}/>
								</div>
							
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		{#if file || $status_store.ota == "started"}
		<div class="my-2 ml-1 is-size-6">
			<div>
				{#if $status_store.ota == "started"}
				Firmware update in progress...
				<div style="width: 80%" class="has-text-centered">
					<ProgressBar value={$status_store.ota_progress} />
				</div>
				{:else if $status_store.ota == "failed" }
					Upload Failed
				{:else if $status_store.ota == "completed" }
					<span class="">{file.name}</span> uploaded successfully, page will reload in few sec
				{:else}
					<div class="s-flex is-align-items-center ml-1 is-size-6">
						<span class="my-2 is-size-6">
							{file.name}
						</span>
						<div class=" is-size-6 is-inline-block">
							<IconButton icon="fa6-solid:square-minus" color="has-text-danger" butn_submit={()=>{file = null}} tooltip="Remove file" />
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="is-flex is-align-items-center is-justify-content-start">
			<Button disabled={uploadButtonState == "loading"} name="Upload" icon="fa6-solid:file-arrow-up" color="is-info" butn_submit={uploadFw} state={uploadButtonState}/>&nbsp;
			<Button disabled={uploadButtonState == "loading"} name="Close" color="is-danger" butn_submit={()=>is_opened=false} />
		</div>
		{:else}
		<div class="is-flex is-align-items-center my-2 ml-1 is-size-6">
			No file selected
		</div>
		<div class="is-flex is-align-items-center is-justify-content-start">
			<SelectFile bind:file={file}/>&nbsp;
			<Button disabled={uploadButtonState == "loading" || fileSent == "ok"} name="Close" color="is-danger" butn_submit={()=>is_opened=false} />
		</div>
		{/if}
	</Box>
</Modal>