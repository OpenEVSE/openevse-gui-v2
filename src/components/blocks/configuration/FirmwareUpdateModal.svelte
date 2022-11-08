<script>
	import { config_store } from "../../../lib/stores/config.js"
	import { link } from "svelte-spa-router"
	import Box from "../../ui/Box.svelte"
	import Button from "../../ui/Button.svelte"
	import Modal from "../../ui/Modal.svelte"
	import SelectFile from "../../ui/SelectFile.svelte"
	import Fa from 'svelte-fa/src/fa.svelte'
	import {faFileCircleCheck, faFileCircleXmark, faSquareMinus} from '@fortawesome/free-solid-svg-icons/index.js'
	export let is_opened = false
	let file

	function uploadFw() {

	}

	$: file, console.log(file)

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
		<div class="has-text-primary my-2">
			<Fa class="is-size-5 mx-2" icon={faFileCircleCheck}/>{file.name}
			<a href="#" on:click={()=> {file = null; console.log("resetfile")}}>
				<div class="has-text-danger is-inline-block">
					<Fa class="is-size-5 mx-1" icon={faSquareMinus} />
				</div>
			</a>
		</div>
		<Button name="Upload" butn_submit={uploadFw} />
		{:else}
		<div class="has-text-danger my-2">
			<Fa class="is-size-5 mx-2" icon={faFileCircleXmark} />No file selected
		</div>
		<SelectFile bind:file={file}/>
		{/if}
		
		<Button name="Cancel" butn_submit={()=>is_opened=false} />
		
	</Box>
</Modal>