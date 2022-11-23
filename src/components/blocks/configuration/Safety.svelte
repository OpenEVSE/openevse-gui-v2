<script>
	import SafetyTableRow from "../../ui/SafetyTableRow.svelte";
	import {config_store} from "../../../lib/stores/config.js"
	import {status_store} from "../../../lib/stores/status.js"
	import Box from "../../ui/Box.svelte"

	export let editable = true

</script>

<Box title="Safety">
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white">Test</th>
				<th class="has-text-white has-text-centered">Enabled</th>
			</tr>
		</thead>
		<tbody>
			<SafetyTableRow title="GFCI Self Test" name="gfci_check" bind:checked={$config_store.gfci_check} {editable} onChange={()=>{config_store.saveParam("gfci_check",$config_store.gfci_check)}} />
			<SafetyTableRow title="Ground Monitoring" name="ground_check" bind:checked={$config_store.ground_check} {editable} onChange={()=>{config_store.saveParam("ground_check",$config_store.ground_check)}} />
			<SafetyTableRow title="Stuck Contact Detection" name="relay_check" bind:checked={$config_store.relay_check} {editable} onChange={()=>{config_store.saveParam("relay_check",$config_store.relay_check)}} />
			<SafetyTableRow title="Temperature Monitoring" name="temp_check" bind:checked={$config_store.temp_check} {editable} onChange={()=>{config_store.saveParam("temp_check",$config_store.temp_check)}} />
			<SafetyTableRow title="Diode Check" name="diode_check" bind:checked={$config_store.diode_check} {editable} onChange={()=>{config_store.saveParam("diode_check",$config_store.diode_check)}} />
			<SafetyTableRow title="Vent Required" name="vent_check" bind:checked={$config_store.vent_check} {editable} onChange={()=>{config_store.saveParam("vent_check",$config_store.vent_check)}} />
		</tbody>
		<thead>
			<tr class="has-background-info">
				<th class="has-text-white">Error</th>
				<th class="has-text-white has-text-centered">Count</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>GFCI</td>
				<td class="has-text-centered"><span class="tag {$status_store.gfcicount==0?'is-primary':'is-danger'} is-primary ">{$status_store.gfcicount}</span></td>
			</tr>
			<tr>
				<td>No Ground</td>
				<td class="has-text-centered"><span class="tag {$status_store.nogndcount==0?'is-primary':'is-danger'}">{$status_store.nogndcount}</span></td>
			</tr>
			<tr>
				<td>Stuck Contact</td>
				<td class="has-text-centered"><span class="tag {$status_store.stuckcount==0?'is-primary':'is-danger'}">{$status_store.stuckcount}</span></td>
			</tr>
		</tbody>
	</Box>