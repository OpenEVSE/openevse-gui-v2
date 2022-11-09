<script>
	import Box from "../../ui/Box.svelte"
	import {config_store} from "../../../lib/stores/config.js"
	import Button from "../../ui/Button.svelte"
	import FirmwareUpdateModal from "./FirmwareUpdateModal.svelte"
	import {httpAPI} from "../../../lib/utils.js"

	let modal
	
	async function restartOpenEvse() {
		restartOpenEvseState = "loading"
		const payload = "json=1&rapi=$FR"
		let res = await httpAPI("POST","/r",payload, "text")
		if (res == "set" )  {
			restartOpenEvseState = "ok"
			setTimeout(() => {
				restartOpenEvseState = ""
					}, 1000);
			return true
		}
		else {
			// cheating as openEVSE api always answer HTTP 500 on reboot command
			restartOpenEvseState = "ok"
			setTimeout(() => {
				restartOpenEvseState = ""
					}, 1000);
			return false
		}
	}

	async function restartESP() {
		restartEspState = "loading"
		let res = await httpAPI("POST","/restart",null,"text")
		if (res == "1" )  {
			restartEspState = "ok"
			setTimeout(() => {
				restartEspState = ""
					}, 1000);
			return true
		}
		else {
			restartEspState = "error"
			setTimeout(() => {
				restartEspState = ""
					}, 1000);
			return false
		}
	}

	let restartOpenEvseState = ""
	let restartEspState = ""
	let fw_modal_opened = false
</script>


<Box title="Hardware">
	<table class="table is-fullwidth is-vcentered">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white" style="width:40%">Hardware</th>
				<th class="has-text-white" style="width:30%">Version</th>
				<th class="has-text-white" style="width:30%">Action</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>OpenEVSE</td>
				<td>{$config_store.firmware}</td>
				<td><div class="has-text-centered"><Button width="80px" size="is-small" name="Restart" butn_submit={restartOpenEvse} state={restartOpenEvseState}/></div></td>
			</tr>
			<tr>
				<td>OpenEVSE Wifi</td>
				<td>{$config_store.version}</td>
				<td>
					<div class="has-text-centered ">
						<div class="mb-2">
							<Button width="80px" size="is-small" name="Restart" butn_submit={restartESP} state={restartEspState}/>
						</div>
						<div class="mb-2">
							<Button bind:this={modal} width="80px" size="is-small" name="Update" butn_submit={()=>fw_modal_opened=true} />
						</div>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
</Box>
{#if fw_modal_opened}
<FirmwareUpdateModal bind:is_opened={fw_modal_opened} />
{/if}