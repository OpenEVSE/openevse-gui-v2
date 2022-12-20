<script>
	import {status_store} from "../../../lib/stores/status.js"
	import {round}		  from "../../../lib/utils.js"
</script>
<style>
	.tag {
		box-sizing: border-box;
		width: 100%;
		font-size: medium;
	}
</style>

<table class="table is-fullwidth">
	<thead>
		<tr class="has-background-info"	>
			<th class="has-text-white py-1">Energy Delivered</th>
			<th class="has-text-white has-text-centered py-1" style="width:40%">kwh</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Session</td>
			<td class="has-text-right"><span class="tag is-info  is-size-6">{round($status_store.session_energy/1000,1)} kwh</span></td>
		</tr>
		<tr>
			<td>Total</td>
			<td class="has-text-right"><span class="tag is-info ">{round($status_store.total_energy,1)} kwh</span></td>
		</tr>
	</tbody>
</table>
