<script>
	import { config_store } from "./../../../lib/stores/config.js";
	import { _ } 			from 'svelte-i18n'
	import {status_store} 	from "../../../lib/stores/status.js"
	import {round}		  	from "../../../lib/utils.js"
</script>
<style>
	.tag {
		box-sizing: border-box;
		width: 100%;
		font-size: medium;
	}
</style>

<div>
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white py-1">{$_("monitoring-energy-delivered")}</th>
				<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("units.kwh")}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{$_("session")}</td>
				<td class="has-text-right"><span class="tag is-info  is-size-6">{round($status_store.session_energy/1000,1)} {$_("units.kwh")}</span></td>
			</tr>
			<tr>
				<td>{$_("total")}</td>
				<td class="has-text-right"><span class="tag is-info ">{round($status_store.total_energy,1)} {$_("units.kwh")}</span></td>
			</tr>
		</tbody>
	</table>
	<table class="table is-fullwidth">

		<thead>
			<tr class="has-background-info"	>
				<th class="has-text-white py-1">{$_("monitoring-tab-manager")}</th>
				<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("value")}</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{$_("monitoring-energy-service")}</td>
				<td class="has-text-right"><span class="tag is-info">{$status_store.service_level}</span></td>
			</tr>
			<tr>
				<td>{$_("monitoring-energy-servicemin")}</td>
				<td class="has-text-right"><span class="tag is-info">{$config_store.min_current_hard} A</span></td>
			</tr>
			<tr>
				<td>{$_("monitoring-energy-servicemax")}</td>
				<td class="has-text-right"><span class="tag is-info">{$config_store.max_current_soft} A</span></td>
			</tr>
		</tbody>
	</table>
</div>