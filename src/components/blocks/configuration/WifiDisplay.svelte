<script>
	import { _ } 	from 'svelte-i18n'
	import WifiIcon from "./../../ui/WifiIcon.svelte";
	export let ssid
	export let rssi
</script>

<style>
	.nopointer {
		cursor: default;
    }
</style>
<div>
	<table class="table has-text-centered is-fullwidth is-bordered is-size-7">
		<thead>
			<tr class="has-background-info">
			<th class="has-text-white has-text-centered" style="width: 70%;">{$_("config.network.ssid")}</th>
			<th class="has-text-white has-text-centered">{$_("config.network.signal")}</th>
			</tr>
		</thead>
		<tbody>
			<tr class="has-background-light">
				<th class="pt-3 has-text-centered">{ssid}</th>
				<td class="pt-2 has-text-centered  has-tooltip-arrow has-tooltip-top nopointer" data-tooltip={rssi + " dBm"}>
					<WifiIcon dbm={rssi}/>
				</td>
			</tr>
		</tbody>
	</table>
</div>