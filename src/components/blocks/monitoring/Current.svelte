<script>
	import { _ } 		  from 'svelte-i18n'
	import {status_store} from "../../../lib/stores/status.js"
	import {config_store} from "../../../lib/stores/config.js"
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
			<th class="has-text-white py-1">{$_("monitoring-tab-settings")}</th>
			<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("value")}</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>{$_("monitoring-settings-service")}</td>
			<td class="has-text-right"><span class="tag is-info">{$status_store.service_level}</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-settings-servicemin")}</td>
			<td class="has-text-right"><span class="tag is-info">{$config_store.min_current_hard} A</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-settings-servicemax")}</td>
			<td class="has-text-right"><span class="tag is-info">{$config_store.max_current_soft} A</span></td>
		</tr>
		<tr>
			<td>{$_("monitoring-settings-sensorscale")}</td>
			<td class="has-text-right"><span class="tag is-info">{$config_store.scale}</span></td>
		</tr>			<tr>
			<td>{$_("monitoring-settings-sensoroffset")}</td>
			<td class="has-text-right"><span class="tag is-info">{$config_store.offset}</span></td>
		</tr>
	</tbody>
</table>
