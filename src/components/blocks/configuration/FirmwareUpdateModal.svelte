<script>
	import { serialQueue } from "./../../../lib/queue.js";
	import { config_store } from "../../../lib/stores/config.js"
	import { status_store } from "../../../lib/stores/status.js"
	import {onDestroy} from "svelte"
	import Box from "../../ui/Box.svelte"
	import Button from "../../ui/Button.svelte"
	import IconButton from "../../ui/IconButton.svelte"
	import Modal from "../../ui/Modal.svelte"
	import SelectFile from "../../ui/SelectFile.svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faFileCircleCheck, faFileCircleXmark, faSquareMinus} from '@fortawesome/free-solid-svg-icons/index.js'
	export let is_opened = false

	let file
	let uploadButtonState = "default"
	let fileSent = "no"
	let percentDone = 0
	let timeout

		onDestroy(() => {
			clearTimeout(timeout)
		})
	const uploadFiles = (url, file, onProgress) =>
		new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.upload.addEventListener('progress', e => onProgress(e.loaded / e.total));
			xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }));
			xhr.addEventListener('error', () => reject(new Error('File upload failed')));
			xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
			xhr.open('POST', url, true);
			const formData = new FormData();
			formData.set("update", file);
			xhr.send(formData);
  		});

	async function uploadFw() {
		// Prevent UI to send any request while OTA is in progress
		serialQueue.pause()
		$status_store.ota_progress = 0
		uploadButtonState = "loading"
		const onProgress = progress => {
			percentDone = Math.round(progress * 100)
			console.log('Progress:', `${percentDone}%`)
		}
		const response = await uploadFiles('/update', file, onProgress)
		if (response.status >= 400) {
			console.log("Upload Error (HTTP" + response.status + ")")
			uploadButtonState = "error"
			fileSent = "ko"
		}
		else {
			uploadButtonState = "ok"
			fileSent = "ok"
			timeout = setTimeout(()=> location.reload(),3000)
		}
		serialQueue.resume()

	}

	$: file, () => {
		fileSent = "no"
	}

</script>

<Modal bind:is_opened>
	<Box title="Firmware Update">
		<div class="pt-2">
			
			<div class="">
				<div class="">
					<table class="table table is-striped is-vcentered is-size-7">
						<thead>
							
							<tr class="has-background-info has-text-white py-1"	>
								<th colspan=2 class="has-text-white py-1">Current Firmware</th>

							</tr>
						</thead>
						<tbody class="is-size-6">
							<tr>
								<td>ESP info</td>
								<td>{$config_store.espinfo}</td>
							</tr>
							<tr>
								<td>Build</td>
								<td>{$config_store.buildenv}</td>
							</tr>
							<tr>
								<td>Version</td>
								<td>{$config_store.version}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		{#if file}
		<div>
			<div class="is-inline-block my-2">
		
			{#if uploadButtonState == "loading"}
				Uploading <span class="is-italic">{file.name}</span>, please wait...
				<progress class="progress is-primary" value={$status_store.ota_progress} max="100">{percentDone}%</progress>
			{:else if (fileSent) == "ko" }
				Upload Failed
			{:else if (fileSent) == "ok" }
				<span class="is-italic">{file.name}</span> uploaded successfully, page will reload in few sec
			{:else}
			<div class="is-flex is-align-items-center">
				<Fa class="is-size-6 mx-2 has-text-primary" icon={faFileCircleCheck}/>
				<span class="my-2 is-family-code is-italic">
					{file.name}
				</span>
				<div class="ml-2 is-size-5 is-inline-block">
					<IconButton icon={faSquareMinus} color="has-text-danger" butn_submit={()=>{file = null}} tooltip="Remove file" />
				</div>
			</div>
			{/if}
			</div>
		</div>

			<Button name="Upload" color="is-primary" butn_submit={uploadFw} state={uploadButtonState}/>
		
		{:else}
		<div class="my-2 is-family-code is-italic">
			<Fa class="is-size-6 has-text-danger mx-2" icon={faFileCircleXmark} />No file selected
		</div>
		<SelectFile bind:file={file}/>
		{/if}
		
		<Button name="Close" color="is-danger" butn_submit={()=>is_opened=false} />
		
	</Box>
</Modal>