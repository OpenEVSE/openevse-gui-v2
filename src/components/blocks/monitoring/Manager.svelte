<script>
	import { claims_target_store } from "./../../../lib/stores/claims_target.js";
	import { _ } 				   from 'svelte-i18n'
	import {status_store} 		   from "../../../lib/stores/status.js"
	import {config_store} 		   from "../../../lib/stores/config.js"
	import {clientid2name, displayIcon} 		   from "../../../lib/utils.js"
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
			<th class="has-text-white has-text-centered py-1">{$_("monitoring-manager-prop")}</th>
			<th class="has-text-white has-text-centered py-1">{$_("monitoring-manager-service")}</th>
			<th class="has-text-white has-text-centered py-1">{$_("monitoring-manager-val")}</th>
		</tr>
	</thead>
	<tbody>
		{#if $claims_target_store.claims.state}
		<tr>
			<td class="has-text-centered has-text-weight-bold">state</td>
			<td class="has-text-centered is-capitalized"><span class="tag is-size-7 is-info has-text-weight-bold">
				<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.state))}></iconify-icon>
				{clientid2name($claims_target_store.claims.state)}
			</span>
		</td>
			<td class="has-text-centered">
				<span class="tag has-text-weight-bold is-size-7 {$claims_target_store.properties.state == "active"?"is-primary":"is-danger"} is-capitalized">
					{$claims_target_store.properties.state}
				</span>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.max_current}
		<tr>
			<td class="has-text-centered has-text-weight-bold">max_current</td>
			<td class="has-text-centered is-capitalized">
				<span class="tag is-size-7 is-info has-text-weight-bold">
					<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.max_current))}></iconify-icon>
					{clientid2name($claims_target_store.claims.max_current)}
				</span>
			</td>
			<td class="has-text-centered">
				<span class="tag has-text-weight-bold is-size-7 is-info is-capitalized">
					{$claims_target_store.properties.max_current}
				</span>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.charge_current}
		<tr>
			<td class="has-text-centered has-text-weight-bold">charge_current</td>
			<td class="has-text-centered is-capitalized">
				<span class="tag is-size-7 is-info has-text-weight-bold">
					<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.charge_current))}></iconify-icon>
					{clientid2name($claims_target_store.claims.charge_current)}
				</span>
			</td>
			<td class="has-text-centered">
				<span class="tag has-text-weight-bold is-size-7 is-info is-capitalized">
					{$claims_target_store.properties.charge_current}
				</span>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.auto_release}
		<tr>
			<td class="has-text-centered has-text-weight-bold">auto_release</td>
			<td class="has-text-centered is-capitalized">
				<span class="tag is-size-7 is-info has-text-weight-bold">
					<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.auto_release))}></iconify-icon>
					{clientid2name($claims_target_store.claims.auto_release)}
				</span>
			</td>
			<td class="has-text-centered">
				<span class="tag has-text-weight-bold is-size-7 is-info is-capitalized">
					{$claims_target_store.properties.auto_release}
				</span>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.time_limit}
		<tr>
			<td class="has-text-centered has-text-weight-bold">time_limit</td>
			<td class="has-text-centered is-capitalized">
				<span class="tag has-text-weight-bold is-size-7 is-info has-text-weight-bold">
					<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.time_limit))}></iconify-icon>
					{clientid2name($claims_target_store.claims.time_limit)}
				</span>
			</td>
			<td class="has-text-centered">
				<span class="tag is-size-7 is-info is-capitalized">
					{$claims_target_store.properties.time_limit}
				</span>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.energy_limit}
		<tr>
			<td class="has-text-centered has-text-weight-bold">energy_limit</td>
			<td class="has-text-centered is-capitalized">
				<span class="tag is-size-7 is-info has-text-weight-bold">
					<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.energy_limit))}></iconify-icon>
					{clientid2name($claims_target_store.claims.energy_limit)}
				</span>
			</td>
			<td class="has-text-centered">
				<span class="tag has-text-weight-bold is-size-7 is-info is-capitalized">
					{$claims_target_store.properties.energy_limit}
				</span>
			</td>
		</tr>
		{/if}
	</tbody>
</table>
