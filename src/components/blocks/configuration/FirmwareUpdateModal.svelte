<script>
	import { config_store } from "../../../lib/stores/config.js";
	import Box from "../../ui/Box.svelte"
	import ButtonFetch from "../../ui/Button.svelte"
	import Modal from "../../ui/Modal.svelte"

	export let is_opened = false

</script>

<Modal bind:is_opened>
	<Box title="Firmware Update">
		<div class="pt-2 columns">
			<div class="column">
				<div class="is-size-6 has-text-weight-semibold">Current Firmware</div>
				<div>
					<table class="table is-vcentered">
						<thead>
							<tr class="has-background-info"	>
								<th class="has-text-white">Name</th>
								<th class="has-text-white">Value</th>
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
		<ButtonFetch name="Close" butn_submit={()=>is_opened=false} />
	</Box>
</Modal>