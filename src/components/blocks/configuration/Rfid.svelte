<script>
	import RemovableTag from "./../../ui/RemovableTag.svelte";
	import { config_store } from "./../../../lib/stores/config.js";
	import { onMount } from "svelte";
	import { status_store } from "./../../../lib/stores/status.js";
	import Button from "./../../ui/Button.svelte";
	import { serialQueue } from "./../../../lib/queue.js";
	import Switch from "./../../ui/Switch.svelte";
	import Box from "../../ui/Box.svelte"
	import {httpAPI} from "../../../lib/utils.js"

	let scanning = false
	let state = "default"
	let tags = []
	let tags_inst = []
	let button_inst

	
	onMount(() => {
		updateTags($config_store.rfid_storage)
	})

	$: updateTags($config_store.rfid_storage)

	function updateTags(store) {
		tags = store.split(",")
	}

	async function toggleRFID() {
		
		let res = await serialQueue.add(() => config_store.saveParam("rfid_enabled", $config_store.rfid_enabled))
	}

	async function scanTag() {
		scanning = true
		let res  = await serialQueue.add(() => httpAPI("GET", "/rfid/add",null,"txt")  )

	}

	async function removeTag(tag,inst) {
		inst.state="loading"
		let str_tags =  tags.filter(function(value, index, arr){ 
       		return value != tag;
    	}).join(",");
		let jsontags = {rfid_storage: str_tags}
		let res = await serialQueue.add(config_store.upload(jsontags))
		if (res)
			inst.state="ok"
		else inst.state="error"
	}

	async function registerTag(tag,inst) {
		inst.state="loading"
	}
</script>

<style>
	.borders {
		border-radius: 10px;
		border: 1px solid rgb(50, 179, 212);
		/* padding: 20px; */
		/* width: 200px;
		height: 150px; */
		padding: 10px;
		max-height: 800px;
		overflow:auto; 
	}
</style>

<Box title="RFID">
	<Switch name="rfidswitch" label="Enable RFID" bind:checked={$config_store.rfid_enabled} onChange={toggleRFID} is_rtl={true} />
	{#if $config_store.rfid_enabled}
		<div class="has-text-weight-bold my-2">Manage scanned tags</div>
		<Button name="Scan" butn_submit={scanTag} disabled={$status_store.rfid_waiting > 0}/>
		{#if $status_store.rfid_waiting > 0}
			<div class="mt-2 has-text-weight-bold">Place your RFID tag on the scanner...</div>
		{/if}
		{#if $status_store.rfid_input}
			<div class="mt-2 has-text-weight-bold">Tag scanned successfully!</div>
			<div class="has-text-weight-bold my-2 has-text-info">UID: {$status_store.rfid_input}</div>
			{#if tags.find($status_store.rfid_input)}
			<div>Badge already registered</div>
			<Button bind:this={button_inst} width="80px" size="is-small" name="Remove" color="is-danger" butn_submit={()=>removeTag($status_store.rfid_input,button_inst)} />
			{:else}
			<div>New badge detected</div>
			<Button bind:this={button_inst} width="80px" size="is-small" name="Register" color="is-primary" butn_submit={()=>registerTag($status_store.rfid_input,button_inst)} />
			{/if}
		{/if}
		{#if tags[0] != "" }
		<div class="borders my-4">
			<div class="has-text-weight-bold is-size-6">Registered Tags</div>
			<ul>
				{#each tags as tag,i}
				<li>
					<RemovableTag bind:this={tags_inst[i]} name={tag} action={()=>removeTag(tag,tags_inst[i])} color={$status_store.rfid_input == tag?"is-primary":"is-info"}/>
				</li>
				{/each}
			</ul>
		</div>
		{/if}
	{/if}
</Box>