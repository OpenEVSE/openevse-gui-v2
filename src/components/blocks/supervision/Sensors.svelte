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

<Box title="Sensors">
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white">Sensor</th>
				<th class="has-text-white has-text-centered" style="width:40%">Value</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Pilot</td>
				<td class="has-text-right"><span class="tag tags is-info">{$status_store.pilot} A</span></td>
			</tr>
			<tr>
				<td>Current</td>
				<td class="has-text-right"><span class="tag tags is-info">{$status_store.amp/1000} A</span></td>
			</tr>
			<tr>
				<td>Voltage</td>
				<td class="has-text-right"><span class="tag tags is-info">{$status_store.voltage} V</span></td>
			</tr>
			<tr>
				<td>EVSE T°</td>
				<td class="has-text-right"><span class="tag tags is-info">{round($status_store.temp/10,1)} °C</span></td>
			</tr>
			<tr>
				<td>ESP32 T°</td>
				<td class="has-text-right"><span class="tag tags is-info">{round($status_store.temp4/10,1)} °C</span></td>
			</tr>
		</tbody>
	</Box>