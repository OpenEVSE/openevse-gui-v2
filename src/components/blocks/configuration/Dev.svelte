<script>
	import { _ } 		from 'svelte-i18n'
	import InputForm 	from "./../../ui/InputForm.svelte";
	import Button 		from "./../../ui/Button.svelte";
	import Box 			from "./../../ui/Box.svelte";
	import {httpAPI} 	from "../../../lib/utils.js"
	import DevHelp 		from "../../help/DevHelp.svelte"

	let rapi_cmd = "$"
	let rapi_cmd_result = []
	let rapiurl = "/r?json=1&rapi="
	let button_send_state = "default"

	function openConsole(cons) {
		let url
		if (cons=="debug")
			url = "/term.html?debug"
		else if (cons=="openevse")
			url = "/term.html?evse"
		// if (import.meta.env.DEV) {
		// 	url = "/api" + url
		// }
		window.open(url, '_blank')
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

</script>
<style>
</style>
<Box title={$_("config.titles.dev")} icon="mdi:console" has_help={true}>
	<div slot="help"><DevHelp /> </div>
	<div class="mt-4 mb-2">
		<Button name="Debug" color="is-info" butn_submit={()=>openConsole("debug")} />
		<Button name="OpenEVSE" color="is-info" butn_submit={()=>openConsole("openevse")} />
	</div>

	<div class="container mt-4 mb-1">
		<div>
			<div class="is-size-7">
			{#each rapi_cmd_result as { cmd, ret } }
			 &gt; {cmd} <br>
			 &lt; {ret} <br>
			{/each}
			</div>
		</div>
		<form on:submit|preventDefault={send_rapi_cmd}>
		<InputForm  title={$_("config.dev.rapi-cmd")} bind:value={rapi_cmd} placeholder="" type="text" />
		<Button name={$_("config.dev.send")} color="is-info" butn_submit={send_rapi_cmd} state={button_send_state}/>
		<Button name={$_("config.dev.clear")} color="is-info" butn_submit={clear_rapi_cmd} />
		<form>
	</div>
</Box>