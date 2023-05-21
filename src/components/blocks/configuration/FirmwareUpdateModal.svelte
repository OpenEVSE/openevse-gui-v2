<script>
	import Checkbox from "./../../ui/Checkbox.svelte";
	import RemovableTag from "./../../ui/RemovableTag.svelte";
	import { _ } 		  		from 'svelte-i18n'
	import { config_store } 	from "./../../../lib/stores/config.js";
	import { serialQueue }		from "./../../../lib/queue.js";
	import { status_store } 	from "../../../lib/stores/status.js"
	import {httpAPI, 
			compareVersion}		from "../../../lib/utils.js" 
	import {onDestroy, onMount} from "svelte"
	import Box 					from "../../ui/Box.svelte"
	import Button 				from "../../ui/Button.svelte"
	import Modal 				from "../../ui/Modal.svelte"
	import SelectFile 			from "../../ui/SelectFile.svelte"
	import ProgressBar			from "../../ui/ProgressBar.svelte";
	
	
	export let is_opened = false
	export let release
	export let prerelease
	export let daily

	let github_upd
	let update = {}
	let file
	let http_update = false
	let uploadButtonState = ""
	let gitUpdateButtonState = ""
	let fileSent = "no"
	let timeout
	let canClose = true
	let confirmed = false
	let build_type = 1 // 1: release, 2: prerelease , 3: dev
	let mounted = false
	let release_has_build = false
	let prerelease_has_build = false
	let daily_has_build = false
	

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
			//file = null
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

	function switchBuilds(type) {
		switch (type) {
			case 1: 
				// use release
				if (release)
					github_upd = release
				break;
			case 2:
				// use prerelease
				if (prerelease)
					github_upd = prerelease
				break;
			case 3:
				// use daily build
				if (daily)
					github_upd = daily
				break;
			default:
				break;
		}
		if (github_upd) {
			// "update" object model {name: undefined, version: undefined, url: undefined, updated_at: undefined}
			update.version = github_upd.name?github_upd.name:""
			update.name = $config_store.buildenv
			update.html_url = github_upd.html_url?github_upd.html_url:""
			let item = github_upd.assets?.find(obj => {
				return obj.name === update.name + "_gui-v2.bin" || obj.name === update.name + ".bin"
			})
			update.updated_at = item?.updated_at
			update.url = item?.browser_download_url
		}

	}

	onMount(() => {
		// check if github releases have build for current platform
		release_has_build = release?.assets?.find(obj => {
			return obj.name === update.name + "_gui-v2.bin" || obj.name === update.name + ".bin"
		})?true:false
		prerelease_has_build = prerelease?.assets?.find(obj => {
			return obj.name === update.name + "_gui-v2.bin" || obj.name === update.name + ".bin"
		})?true:false
		daily_has_build = daily?.assets?.find(obj => {
			return obj.name === update.name + "_gui-v2.bin" || obj.name === update.name + ".bin"
		})?true:false
	})

	$: $status_store.ota,displayOta()
	$: switchBuilds(build_type)


</script>

<style>

</style>

{#if mounted}
<Modal bind:is_opened {canClose}>
	<Box title={$_("config.titles.firmware-update")} icon="fa6-solid:microchip">
		<div class="pt-2">
			
			<div class="">
				<table class="table is-fullwidth is-vcentered has-text-dark mb-0">
					<tbody class="is-size-6">
						<tr>
							<td class="has-text-weight-semibold" width="15%">{$_("config.firmware.espinfo")}</td>
							<td class="">{$config_store.espinfo}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold">{$_("config.firmware.build")}</td>
							<td
							 class="">{$config_store.buildenv}</td>
						</tr>
						<tr>
							<td class="has-text-weight-semibold">{$_("config.firmware.installed")}</td>
							<td class="">{$config_store.version}</td>
						</tr>
						{#if github_upd}
						<tr>
							<td class="has-text-weight-semibold pt-3">
								<div class="is-flex is-align-items-start">
									<span class="">{$_("config.firmware.latest")}</span>
									<a href={update.html_url} target="_blank" rel="noreferrer" class="has-text-dark is-flex is-align-items-center ml-2">
										<iconify-icon inline icon="icon-park-outline:github" class="is-size-4"></iconify-icon>
									</a>
								</div>	
							</td>
							<td class="">
								<div class="is-flex is-justify-content-space-between is-flex-wrap-wrap">
									<div class="is-inline-block">
										<div class="is-size-6 has-text-weight-bold">{update.version} </div>
										<div class="is-size-7">{update.updated_at}</div>
									</div>
									<div class="ml-4">
										{#key update.version}
										{#if !confirmed && (release_has_build || prerelease_has_build || daily_has_build)}
										<div class="mb-2">
											
											<Button 
											size="is-responsive" 
											icon="fa6-solid:cloud-arrow-down" 
											tooltip={$_("config.firmware.gh-install")}
											disabled={uploadButtonState == "loading" || gitUpdateButtonState == "loading"} 
											name={$_("config.firmware.install")}
											color="{$config_store.version != update.version ?"is-primary":"is-info	"}" 
											butn_submit={()=>{confirmed=true}}

											/>
										</div>
										{#if http_update && !$status_store.ota_progress && $status_store.ota != "completed"}
										<div class="has-text-centered has-text-dark has-text-weight-bold">{$_("config.firmware.httpota-start")}</div>
										{/if}
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
						{/if}
					</tbody>
				</table>
				{#if !http_update && !$status_store.ota_progress && github_upd}
				<div class="is-flex is-justify-content-space-evenly">
					{#if release_has_build}
					<div class="">
						<Checkbox 
							 bold
							color="dark"
							label="Release"
							checked={build_type == 1}
							onChange={() => {build_type = 1}}
							tooltip={null}
					/>
					</div>
					{/if}
					{#if prerelease_has_build && compareVersion(prerelease?.tag_name, release?.tag_name) >= 0 }
					<div class="">
						<Checkbox 
							 bold
							color="dark"
							label="PreRelease"
							checked={build_type == 2}
							onChange={() => {build_type = 2}}
							tooltip={null}
						/>
					</div>
					{/if}
					{#if daily_has_build}
					<div class="">
						<Checkbox 
							 bold
							color="dark"
							label="Dev"
							checked={build_type == 3}
							onChange={() => {build_type = 3}}
							tooltip={null}
						/>
					</div>
					{/if}
				</div>
				{/if}
			</div>
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