<script>
	import {status_store} from "../../../lib/stores/status.js"

</script>
<table class="table is-fullwidth">
	<thead>
		<tr class="has-background-info">
			<th class="has-text-white">Errors</th>
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
</table>