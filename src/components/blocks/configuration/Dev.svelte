<script>
	import { tesla_store } from "./../../../lib/stores/tesla.js";
	import { schedule_store } from "./../../../lib/stores/schedule.js";
	import { certificate_store } from "./../../../lib/stores/certificates.js";
	import { plan_store } from "./../../../lib/stores/plan.js";
	import { override_store } from "./../../../lib/stores/override.js";
	import { limit_store } from "./../../../lib/stores/limit.js";
	import { uistates_store } from "./../../../lib/stores/uistates.js";
	import { status_store } from "./../../../lib/stores/status.js";
	import { claims_store } from "./../../../lib/stores/claims.js";
	import { claims_target_store } from "./../../../lib/stores/claims_target.js";
	import { config_store } from "./../../../lib/stores/config.js";

	function fmtBytes(b) {
		if (b == null || b === undefined) return "—";
		if (b >= 1048576) return (b / 1048576).toFixed(2) + " MB";
		if (b >= 1024)    return (b / 1024).toFixed(1) + " KB";
		return b + " B";
	}
	import Borders from "./../../ui/Borders.svelte";
	import { _ } 		from 'svelte-i18n'
	import InputForm 	from "./../../ui/InputForm.svelte";
	import Button 		from "./../../ui/Button.svelte";
	import Box 			from "./../../ui/Box.svelte";
	import {httpAPI} 	from "../../../lib/utils.js"
	import DevHelp 		from "../../help/DevHelp.svelte"
	import Terminal 	from "./Terminal.svelte"

	let rapi_cmd = "$"
	let rapi_cmd_result = []
	let rapiurl = "/r?json=1&rapi="
	let button_send_state = ""
	let opened = false
	let mode
	let export_link
	let button_export_state

	function openConsole(cons) {
		// let url
		if (cons=="debug") {
			// url = "/term.html?debug"
			mode = "debug"
		}
		else if (cons=="evse") {
			// url = "/term.html?evse"
			mode = "evse"
		}
		// if (import.meta.env.DEV) {
		// 	url = "/api" + url
		// }
		opened = true
		// window.open(url, '_blank')
	}

	async function send_rapi_cmd() {
		button_send_state = "loading"
		let res = await httpAPI("GET",rapiurl + rapi_cmd,null)
		if (res=="error") {
			button_send_state = "error"
			return false
		}
		else {
			button_send_state = "ok"
			rapi_cmd_result.push(res)
			rapi_cmd_result = rapi_cmd_result
			rapi_cmd = "$"
			return true
		}
	}

	function clear_rapi_cmd() {
		rapi_cmd_result = []

	}

	async function exportData() {
		button_export_state = "loading"
		// get usefull data
		let data = {}

		// copy stores
		data.target = {...$claims_target_store}
		// get claims store not cached here
		if (!await claims_store.download()) {
			button_export_state = "error"
			return
		}
		data.override = {...$override_store}
		data.claims = {...$claims_store}
		data.status = {...$status_store}
		data.plan = {...$plan_store}
		data.schedule = {...$schedule_store}
		data.certificates = {...$certificate_store}
		data.config = {...$config_store}
		data.limits = {...$limit_store}
		data.tesla = {...$tesla_store}

		data.uistates = {...$uistates_store}


		// create file
		const file = URL.createObjectURL(new Blob([JSON.stringify(data,null,4)], { type: 'application/json' }))
		export_link.href =  file
		export_link.download = "export.json"
		button_export_state = "ok"
		export_link.click()
		URL.revokeObjectURL(export_link.href);
	}

</script>
<style>
</style>
<Box title={$_("config.titles.dev")} icon="mdi:console" has_help={true} back={true}>
	<div slot="help"><DevHelp /> </div>
	<div class="columns is-centered is-vcentered">
		<div class="column is-two-thirds">
			<div class="mt-4 mb-2 is-flex is-justify-content-center">
				<Borders grow>
					<div class="mb-2">
						<div class="has-text-dark has-text-weight-bold has-text-centered mb-2">{$_("config.dev.consoles")}</div>
						<Button name="Debug" color="is-info" butn_submit={()=>openConsole("debug")} />
						<Button name="OpenEVSE" color="is-info" butn_submit={()=>openConsole("evse")} />
					</div>
				</Borders>
			</div>
			<div class="mt-4 mb-1 is-flex is-justify-content-center">
				<Borders grow>
					<div class="mb-2">
						<div>
							<div class="is-size-7 has-text-left my-2 mx-2">
							{#each rapi_cmd_result as { cmd, ret, error } }
							&gt; <span class="rapi-cmd">{cmd}</span><br>
							&lt; {#if ret !== undefined}<span class="rapi-res">{ret}</span>{/if}
              {#if error !== undefined}<span class="rapi-error">{error}</span>{/if} <br>
							{/each}
							</div>
							<form on:submit|preventDefault={send_rapi_cmd}>
								<InputForm  title={$_("config.dev.rapi-cmd")} bind:value={rapi_cmd} placeholder="" type="text" />
								<div class="is-inline-block">
									<Button name={$_("config.dev.send")} color="is-info" butn_submit={send_rapi_cmd} state={button_send_state}/>
								</div>
								<div class="is-inline-block">
									<Button name={$_("config.dev.clear")} color="is-info" butn_submit={clear_rapi_cmd} />
								</div>
							</form>
						</div>
					</div>
				</Borders>
			</div>
			<div class="mt-4 mb-1 is-flex is-justify-content-center">
				<Borders grow>
					<div class="has-text-dark has-text-weight-bold has-text-centered mb-2">{$_("config.dev.sysinfo")}</div>
					<table class="table is-narrow is-fullwidth is-size-7">
						<thead>
							<tr>
								<th></th>
								<th class="has-text-right">{$_("config.dev.total")}</th>
								<th class="has-text-right">{$_("config.dev.free")}</th>
								<th class="has-text-right">{$_("config.dev.used")}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="has-text-weight-bold">{$_("config.dev.ram")}</td>
								<td class="has-text-right">{fmtBytes($config_store.heap_size)}</td>
								<td class="has-text-right">{fmtBytes($status_store?.free_heap)}</td>
								<td class="has-text-right">{fmtBytes($config_store.heap_size && $status_store?.free_heap != null ? $config_store.heap_size - $status_store.free_heap : undefined)}</td>
							</tr>
							<tr>
								<td class="has-text-weight-bold">{$_("config.dev.flash-fs")}</td>
								<td class="has-text-right">{fmtBytes($config_store.littlefs_size)}</td>
								<td class="has-text-right">{fmtBytes($status_store?.littlefs_free)}</td>
								<td class="has-text-right">{fmtBytes($status_store?.littlefs_used)}</td>
							</tr>
							<tr>
								<td class="has-text-weight-bold">{$_("config.dev.app-part")}</td>
								<td class="has-text-right">{fmtBytes($config_store.app0_size)}</td>
								<td class="has-text-right">{fmtBytes($config_store.app0_size && $config_store.sketch_size != null ? $config_store.app0_size - $config_store.sketch_size : undefined)}</td>
								<td class="has-text-right">{fmtBytes($config_store.sketch_size)}</td>
							</tr>
						</tbody>
					</table>
				</Borders>
			</div>
			<div class="mt-4 mb-1 is-flex is-justify-content-center">
				<Borders grow>
					<div class="has-text-dark has-text-weight-bold has-text-centered mb-2">{$_("config.dev.exportdata")}</div>
						<Button name={$_("config.dev.export")} color="is-info" butn_submit={exportData} state={button_export_state}/>
						<div class="is-hidden">
							<a bind:this={export_link} href={null} >null</a>
						</div>
				</Borders>
			</div>
		</div>
	</div>
</Box>
<!-- <Modal bind:is_opened canClose={true}> -->
	{#if opened}
	<Terminal mode={mode} bind:opened={opened}/>
	{/if}
<!-- </Modal> -->
