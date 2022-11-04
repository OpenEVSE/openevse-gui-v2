<script>
	import {status_store} from "../../../lib/stores/status.js"
	import Box from "../../ui/Box.svelte"
	import {round} from "../../../lib/utils.js"
</script>
<style>
	.tags {
		box-sizing: border-box;
		width: 100%;
	}
</style>
<Box title="Energy Delivered">
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white">Name</th>
				<th class="has-text-white" style="width:40%">kWh</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Session</td>
				<td class="has-text-right"><span class="tag tags is-info">{round($status_store.session_energy/1000,1)} kWh</span></td>
			</tr>
			<tr>
				<td>Total</td>
				<td class="has-text-right"><span class="tag tags is-info">{round($status_store.total_energy,1)} kWh</span></td>
			</tr>
		</tbody>
</Box>