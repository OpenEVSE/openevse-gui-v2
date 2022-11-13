<script>
	import {status_store} from "../../../lib/stores/status.js"
	import {config_store} from "../../../lib/stores/config.js"
	import Box from "../../ui/Box.svelte"
	import {round} from "../../../lib/utils.js"
</script>
<style>
	.tags {
		box-sizing: border-box;
		width: 100%;
	}
</style>
<Box title="Current">
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white">Name</th>
				<th class="has-text-white has-text-centered" style="width:40%">Value</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Service Level</td>
				<td class="has-text-right"><span class="tag tags is-info">{$status_store.service_level}</span></td>
			</tr>
			<tr>
				<td>Level 2 Minimum</td>
				<td class="has-text-right"><span class="tag tags is-info">{$config_store.min_current_hard} A</span></td>
			</tr>
			<tr>
				<td>Level 2 Maximum</td>
				<td class="has-text-right"><span class="tag tags is-info">{$config_store.max_current_soft} A</span></td>
			</tr>
			<tr>
				<td>Sensor Scale</td>
				<td class="has-text-right"><span class="tag tags is-info">{$config_store.scale}</span></td>
			</tr>			<tr>
				<td>Sensor Offset</td>
				<td class="has-text-right"><span class="tag tags is-info">{$config_store.offset}</span></td>
			</tr>
		</tbody>
</Box>