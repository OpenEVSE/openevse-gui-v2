<script>
	import { config_store } from "../../../lib/stores/config.js";
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
			<tr class="has-background-info is-size-7-mobile"	>
				<th class="has-text-white py-1">{$_("monitoring-energy-delivered")}</th>
				<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("units.kwh")}</th>
			</tr>
		</thead>
		<tbody>
			<tr class="is-size-7-mobile">
				<td>{$_("session")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{round($status_store.session_energy/1000,1)} {$_("units.kwh")}</span></td>
			</tr>
			<tr class="is-size-7-mobile">
				<td>{$_("total")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark ">{round($status_store.total_energy,1)} {$_("units.kwh")}</span></td>
			</tr>
		</tbody>
	</table>
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info is-size-7-mobile"	>
				<th class="has-text-white py-1">{$_("monitoring-tab-sensors")}</th>
				<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("value")}</th>
			</tr>
		</thead>
		<tbody class="is-size-7-mobile has-text">
			<tr>
				<td>{$_("monitoring-sensors-pilot")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{$status_store.pilot} {$_("units.A")}</span></td>
			</tr>
			<tr>
				<td>{$_("monitoring-sensors-current")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{$status_store.amp/1000} {$_("units.A")}</span></td>
			</tr>
			<tr>
				<td>{$_("monitoring-sensors-voltage")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{$status_store.voltage} {$_("units.V")}</span></td>
			</tr>
			<tr>
				<td>{$_("monitoring-sensors-evsetemp")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{round($status_store.temp/10,1)} {$_("units.C")}</span></td>
			</tr>
			<tr>
				<td>{$_("monitoring-sensors-esptemp")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{round($status_store.temp4/10,1)} {$_("units.C")}</span></td>
			</tr>
		</tbody>
	</table>
	<table class="table is-fullwidth">

		<thead>
			<tr class="has-background-info is-size-7-mobile"	>
				<th class="has-text-white py-1">{$_("monitoring-energy-params")}</th>
				<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("value")}</th>
			</tr>
		</thead>
		<tbody>
			<tr class="is-size-7-mobile">
				<td>{$_("monitoring-energy-service")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{$status_store.service_level}</span></td>
			</tr>
			<tr class="is-size-7-mobile">
				<td>{$_("monitoring-energy-servicemin")}</td>
				<td class="has-text-right"><span class="tag is-normal  is-dark">{$config_store.min_current_hard} A</span></td>
			</tr>
			<tr class="is-size-7-mobile">
				<td>{$_("monitoring-energy-servicemax")}</td>
				<td class="has-text-right"><span class="tag is-normal  is-dark">{$config_store.max_current_soft} A</span></td>
			</tr>
		</tbody>
	</table>
</div>