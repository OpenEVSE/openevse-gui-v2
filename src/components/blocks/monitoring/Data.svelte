<script>
	import { config_store } from "../../../lib/stores/config.js";
	import { _ } 			from 'svelte-i18n'
	import {status_store} 	from "../../../lib/stores/status.js"
	import {round}		  	from "../../../lib/utils.js"
	import {sec2time, s2mns, miles2km} from "../../../lib/utils.js"

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
				<th class="has-text-white py-1" style="width: 70%">{$_("monitoring-energy-delivered")}</th>
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
			{#if (typeof $status_store.total_day !== "undefined") }
			<tr class="is-size-7-mobile">
				<td>{$_("monitoring-total-day")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark ">{round($status_store.total_day,1)} {$_("units.kwh")}</span></td>
			</tr>
			{/if}
			{#if (typeof $status_store.total_week !== "undefined") }
			<tr class="is-size-7-mobile">
				<td>{$_("monitoring-total-week")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark ">{round($status_store.total_week,1)} {$_("units.kwh")}</span></td>
			</tr>
			{/if}
			{#if (typeof $status_store.total_month !== "undefined") }
			<tr class="is-size-7-mobile">
				<td>{$_("monitoring-total-month")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark ">{round($status_store.total_month,1)} {$_("units.kwh")}</span></td>
			</tr>
			{/if}
			{#if (typeof $status_store.total_year !== "undefined") }
			<tr class="is-size-7-mobile">
				<td>{$_("monitoring-total-year")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark ">{round($status_store.total_year,1)} {$_("units.kwh")}</span></td>
			</tr>
			{/if}
		</tbody>
	</table>
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info is-size-7-mobile"	>
				<th class="has-text-white py-1" style="width: 70%">{$_("monitoring-tab-sensors")}</th>
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
	{#if $status_store.battery_level}
	<table class="table is-fullwidth">
		<thead>
			<tr class="has-background-info is-size-7-mobile">
				<th class="has-text-white py-1" style="width: 70%">{$_("config.vehicle.vehicle")}</th>
				<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("value")}</th>
			</tr>
		</thead>
		<tbody>
			<tr class="is-size-7-mobile">
				<td>{$_("config.vehicle.battery")}</td>
				<td class="has-text-right"><span class="tag is-normal is-dark">{$status_store.battery_level}%</span></td>
			</tr>
			<tr class="is-size-7-mobile">
				<td>{$_("config.vehicle.range")}</td>
				<td class="has-text-right">
					<span class="tag is-normal  is-dark">
						{#if !$config_store.tesla_enabled || $config_store.tesla_enabled && $config_store.mqtt_vehicle_range_miles}
						{$status_store.battery_range}
						{:else if !$config_store.mqtt_vehicle_range_miles}
						{miles2km($status_store.battery_range)}
						{/if}
						{#if $config_store.mqtt_vehicle_range_miles}
						{$_("units.miles")}
						{:else}
						{$_("units.km")}
						{/if}
					</span>
				</td>
			</tr>
			<tr class="is-size-7-mobile">
				<td>{$_("config.vehicle.timeleft")}</td>
				<td class="has-text-right"><span class="tag is-normal  is-dark">{sec2time($status_store.time_to_full_charge)}</span></td>
			</tr>
		</tbody>
	</table>
	{/if}

	<table class="table is-fullwidth">

		<thead>
			<tr class="has-background-info is-size-7-mobile"	>
				<th class="has-text-white py-1" style="width: 70%">{$_("monitoring-energy-params")}</th>
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