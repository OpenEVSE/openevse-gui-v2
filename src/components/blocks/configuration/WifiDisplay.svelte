<script>
	import {dbm2icon} from "../../../lib/utils.js"
	import InlineSVG from 'svelte-inline-svg'
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
			<th class="has-text-white has-text-centered" style="width: 70%;">SSID</th>
			<th class="has-text-white has-text-centered">Signal</th>
			</tr>
		</thead>
		<tbody>
			<tr class="has-background-light">
				<th class="pt-3 has-text-centered">{ssid}</th>
				<td class="pt-2 has-text-centered  has-tooltip-arrow has-tooltip-top nopointer" data-tooltip={rssi + " dBm"}>
					<InlineSVG src={dbm2icon(rssi)} {...{width: 24, height: 24}}/>
				</td>
			</tr>
		</tbody>
	</table>
</div>