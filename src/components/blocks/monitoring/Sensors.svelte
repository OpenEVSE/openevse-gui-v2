<script>
	import { config_store } from "./../../../lib/stores/config.js";
	import { _ } 		    from 'svelte-i18n'
	import {status_store}   from "../../../lib/stores/status.js"
	import {round} 		    from "../../../lib/utils.js"

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
			<th class="has-text-white py-1">{$_("monitoring-tab-sensors")}</th>
			<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("value")}</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>{$_("monitoring-sensors-pilot")}</td>
			<td class="has-text-right"><span class="tag is-info">{$status_store.pilot} {$_("units.A")}</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-sensors-current")}</td>
			<td class="has-text-right"><span class="tag is-info">{$status_store.amp/1000} {$_("units.A")}</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-sensors-voltage")}</td>
			<td class="has-text-right"><span class="tag is-info">{$status_store.voltage} {$_("units.V")}</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-sensors-evsetemp")}</td>
			<td class="has-text-right"><span class="tag is-info">{round($status_store.temp/10,1)} {$_("units.C")}</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-sensors-esptemp")}</td>
			<td class="has-text-right"><span class="tag is-info">{round($status_store.temp4/10,1)} {$_("units.C")}</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-sensors-sensorscale")}</td>
			<td class="has-text-right"><span class="tag is-info">{$config_store.scale}</span></td>
		</tr>			<tr>
			<td>{$_("monitoring-sensors-sensoroffset")}</td>
			<td class="has-text-right"><span class="tag is-info">{$config_store.offset}</span></td>
		</tr>
	</tbody>
</table>