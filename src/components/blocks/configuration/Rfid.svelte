<script>
	import { _ } 		      from 'svelte-i18n'
	import Borders 			  from "./../../ui/Borders.svelte";
	import { uistates_store } from "./../../../lib/stores/uistates.js";
	import { config_store }   from "./../../../lib/stores/config.js";
	import { status_store }   from "./../../../lib/stores/status.js";
	import {httpAPI} 		  from "../../../lib/utils.js"
	import { serialQueue }    from "./../../../lib/queue.js";
	import { onMount } 		  from "svelte";
	import RemovableTag 	  from "./../../ui/RemovableTag.svelte";
	import Button 			  from "./../../ui/Button.svelte";
	import Switch 			  from "./../../ui/Switch.svelte";
	import Box 				  from "../../ui/Box.svelte"

	let mounted = false
	let scanning = false
	let tags = []
	let tags_inst = []
	let but_scan_state
	let button_inst
	let button2_inst

	let formdata

	
	onMount(() => {
		updateTags($config_store.rfid_storage)
		updateFormData()
		mounted = true
	})
	$: $config_store.rfid_storage, resetStates()
	$: updateTags($config_store.rfid_storage)
	$: scanState($uistates_store.rfid_waiting)

	let updateFormData = () => {
		formdata = {
			rfid_enabled: {val: $config_store.rfid_enabled, state: ""}
		}	
	}


	function scanState(count) {
		if (count != undefined) {
			but_scan_state = ""
		}	
	}

	function updateTags(store) {
		if (store)
			tags = store.split(",")
	}

	async function toggleRFID() {
		formdata.rfid_enabled.state = "loading"
		if (await serialQueue.add(() => config_store.saveParam("rfid_enabled", formdata.rfid_enabled.val))) {
			formdata.rfid_enabled.state = "ok"
					return true
		} else {
			formdata.rfid_enabled.state = "error"
			return false
		}
	}

	async function scanTag() {
		scanning = true
		but_scan_state = "loading"
		httpAPI("GET", "/rfid/add",null,"txt",60000)


	}

	async function removeTag(tag,inst) {
		inst.state="loading"
		let jsontags = {
			rfid_storage: ""
		}

		if (tag!="all") {
			let str_tags =  tags.filter(function(value, index, arr){ 
				return value != tag;
			}).join(",");
			jsontags.rfid_storage = str_tags
		} else {
			jsontags.rfid_enabled = false
		}

		
		let res = await serialQueue.add(() => config_store.upload(jsontags))
		if (res) {
			inst.state="ok"
		}
		else inst.state="error"
	}

	async function registerTag(tag,inst) {
		inst.state="loading"
		tags.push(tag)
		const output = tags.join(",")
		const jsondata = {
			rfid_storage: output
		}
		let res = await serialQueue.add(() => config_store.upload(jsondata)) 
		$status_store.rfid_input = ""
		if (res) {
			inst.state="ok"
		}
		else inst.state="error"
	}

	function resetStates() {
		for (let i = 0; i < tags_inst.length; i++ ) {
			if (tags_inst[i])
				tags_inst[i].state = ""
		}
	}

	
</script>
<style>
	.enable {
		min-width: 230px;
	}
	
</style>
{#if mounted}
<Box title={$_("config.titles.rfid")} icon="bx:rfid" back={true}>

	<div class="pb-1 is-flex is-align-items-center is-justify-content-center">
		<Borders classes={$config_store.rfid_enabled?"has-background-primary-light":"has-background-light"}>
			<div class="enable">
				<Switch name="rfidswitch" label={formdata.rfid_enabled.val?$_("enabled"):$_("disabled")} bind:checked={formdata.rfid_enabled.val} disabled={formdata.rfid_enabled.state=="loading"} onChange={toggleRFID}/>
			</div>
			
		</Borders>
	</div>

	{#if formdata.rfid_enabled.val}
	<div class="columns is-centered m-0 p-0">
		<div class="column is-two-thirds m-0 pb-1">
			<div class=" is-flex is-justify-content-center has-text-dark">
				<Borders grow>
					<div class="has-text-centered pb-2">
						<div class="has-text-weight-bold mb-4 has-text-dark">{$_("config.rfid.managetag")}</div>
						<Button name={$uistates_store.rfid_waiting>0?$uistates_store.rfid_waiting:$_("config.rfid.scan")} butn_submit={scanTag} bind:state={but_scan_state} disabled={$uistates_store.rfid_waiting > 0}/>
						<!-- <div class="tag is-info {$uistates_store.rfidscan_update>0?"":"is-hidden"}">{$uistates_store.rfidscan_update}</div> -->
						{#if $uistates_store.rfid_waiting > 0}
						<div class="mt-2 has-text-weight-bold has-text-dark">{$_("config.rfid.placetag")}
						</div>
						{:else if $status_store.rfid_input}
						<div class="mt-2 has-text-weight-bold has-text-dark">{$_("config.rfid.scansuccess")}</div>
						<div class="has-text-weight-bold my-2 has-text-info">UID: {$status_store.rfid_input}</div>
						{#if tags.find(element => element == $status_store.rfid_input)}
						<div>{$_("config.rfid.tagregistered")}</div>
						<Button bind:this={button_inst} width="80px" size="is-small" name={$_("config.rfid.remove")} color="is-danger" butn_submit={()=>removeTag($status_store.rfid_input,button_inst)} />
						{:else}
						<div>{$_("config.rfid.newtag")}</div>
						<Button bind:this={button_inst} width="80px" size="is-small" name={$_("config.rfid.register")} color="is-primary" butn_submit={()=>registerTag($status_store.rfid_input,button_inst)} />
						{/if}
					{/if}
					</div>
				</Borders>
			</div>
		</div>
	</div>
	{/if}
	{#if tags.length > 0 }
	<div class="columns is-centered m-0 pb-1">
		<div class="column is-two-thirds m-0">
			<div class="is-flex is-justify-content-center">
				<Borders grow>
					<div class="has-text-weight-bold is-size-6 has-text-centered mb-2">{$_("config.rfid.registeredtags")}</div>
					<div class="has-text-centered mt-4">
						<Button bind:this={button2_inst} name={$_("config.rfid.removeall")} color="is-danger" butn_submit={()=>removeTag("all",button2_inst)} />
					</div>
					<div class="scrollable my-2">
						{#each tags as tag,i}
							<RemovableTag bind:this={tags_inst[i]} name={tag} action={()=>removeTag(tag,tags_inst[i])} color={$status_store.rfid_input == tag?"is-primary":"is-info"}/>
						{/each}
					</div>
				</Borders>
				
			</div>
		</div>
	</div>

	{/if}
</Box>
{/if}