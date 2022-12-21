<script>
	import Borders from "./../../ui/Borders.svelte";
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


	let scanning = false
	let tags = []
	let tags_inst = []
	let but_scan_state
	let button_inst
	let button2_inst

	
	onMount(() => {
		updateTags($config_store.rfid_storage)
	})
	$: $config_store.rfid_storage, resetStates()
	$: updateTags($config_store.rfid_storage)
	$: scanState($status_store.rfid_waiting)

	function scanState(count) {
		if (count != undefined) {
			but_scan_state = "default"
		}	
	}

	function updateTags(store) {
		tags = store.split(",")
	}

	async function toggleRFID() {
		let res = await serialQueue.add(() => config_store.saveParam("rfid_enabled", $config_store.rfid_enabled))
	}

	async function scanTag() {
		scanning = true
		but_scan_state = "loading"
		serialQueue.add(() => httpAPI("GET", "/rfid/add",null,"txt",5000)  )

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
			//$config_store.rfid_store = str_tags
			inst.state="ok"
		}
		else inst.state="error"
	}

	async function registerTag(tag,inst) {
		inst.state="loading"
	}

	function resetStates() {
		for (let i = 0; i < tags_inst.length; i++ ) {
			if (tags_inst[i])
				tags_inst[i].state = ""
		}
	}

	
</script>

<style>
	.scrollable {
		/* max-height: 100%; */
		/* overflow:hidden;
		box-sizing: content-box;
		overflow-y: scroll;
		overscroll-behavior-y: contain; */
	}

</style>

<Box title="RFID" icon="bx:rfid" >
	<Switch name="rfidswitch" label="Enable RFID" bind:checked={$config_store.rfid_enabled} onChange={toggleRFID}/>
	{#if $config_store.rfid_enabled}
	<div class="is-flex is-justify-content-center mt-3">
		<Borders>
			<div class="has-text-centered pb-2">
				<div class="has-text-weight-bold mb-4">Manage scanned tags</div>
			<Button name={$uistates_store.rfidscan_update>0?$uistates_store.rfidscan_update:"Scan"} butn_submit={scanTag} bind:state={but_scan_state} disabled={$status_store.rfid_waiting > 0}/>
				<!-- <div class="tag is-info {$uistates_store.rfidscan_update>0?"":"is-hidden"}">{$uistates_store.rfidscan_update}</div> -->
			{#if $status_store.rfid_waiting > 0}
				<div class="mt-2 has-text-weight-bold">Place your RFID tag on the scanner... 
				</div>
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
			</div>
		</Borders>
	</div>
	{/if}
	{#if tags[0] != "" }
	<div class="is-flex is-justify-content-center">
		<Borders>
			<div class="has-text-weight-bold is-size-6 has-text-centered mb-2">Registered Tags</div>
					<div class="scrollable my-2">
				
						{#each tags as tag,i}
							<RemovableTag bind:this={tags_inst[i]} name={tag} action={()=>removeTag(tag,tags_inst[i])} color={$status_store.rfid_input == tag?"is-primary":"is-info"}/>
						{/each}
						
					</div>
					<div class="has-text-centered mt-4">
						<Button bind:this={button2_inst} name="Remove All" size="is-small" color="is-danger" butn_submit={()=>removeTag("all",button2_inst)} />
					</div>
			
		</Borders>
	</div>
	{/if}
</Box>