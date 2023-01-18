<script>
	import { claims_target_store } from "./../../../lib/stores/claims_target.js";
	import { _ } 				   from 'svelte-i18n'
	import {status_store} 		   from "../../../lib/stores/status.js"
	import {config_store} 		   from "../../../lib/stores/config.js"
	import {clientid2name, displayIcon} 		   from "../../../lib/utils.js"
</script>
<style>
	.tag.service {
		box-sizing: border-box;
		width: 14ch;
	}
	.tag.val {
		box-sizing: border-box;
		width: 12ch;
	}
</style>
<table class="table is-fullwidth">
	<thead class="is-size-7-mobile">
		<tr class="has-background-info"	>
			<th class="has-text-white has-text-left py-1">{$_("monitoring-manager-prop")}</th>
			<th class="has-text-white has-text-centered py-1" style="width:40%">{$_("monitoring-manager-service")} | {$_("monitoring-manager-val")}</th>
		</tr>
	</thead>
	<tbody>
		{#if $claims_target_store.claims.state}
		<tr>
			<td class="has-text-left is-italic is-size-7-mobile">state</td>
			<td class="has-text-centered is-capitalized is-flex is-justify-content-center">
				<div class="tags has-addons">
					<span class="tag service is-size-7-mobile is-info has-text-weight-bold">
						<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.state))}></iconify-icon>
						{clientid2name($claims_target_store.claims.state)}
					</span>
					<span class="tag val has-text-weight-bold is-size-7-mobile {$claims_target_store.properties.state == "active"?"is-primary":"is-danger"} is-capitalized">
						{$_($claims_target_store.properties.state)}
					</span>
				</div>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.max_current}
		<tr>
			<td class="has-text-left is-italic is-size-7-mobile">max_current</td>
			<td class="has-text-centered is-capitalized is-flex is-justify-content-center">
				<div class="tags has-addons">
					<span class="tag service is-info has-text-weight-bold is-size-7-mobile">
						<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.max_current))}></iconify-icon>
						{clientid2name($claims_target_store.claims.max_current)}
					</span>
					<span class="tag val has-text-weight-bold is-info is-capitalized is-size-7-mobile">
						{$claims_target_store.properties.max_current}
					</span>
				</div>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.charge_current}
		<tr>
			<td class="has-text-left is-italic is-size-7-mobile">charge_current</td>
			<td class="has-text-centered is-capitalized is-flex is-justify-content-center">
				<div class="tags has-addons">
					<span class="tag service is-info has-text-weight-bold is-size-7-mobile">
						<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.charge_current))}></iconify-icon>
						{clientid2name($claims_target_store.claims.charge_current)}
					</span>
					<span class="tag val has-text-weight-bold is-info is-capitalized is-size-7-mobile">
						{$claims_target_store.properties.charge_current}
					</span>
				</div>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.auto_release}
		<tr>
			<td class="has-text-left is-italic is-size-7-mobile">auto_release</td>
			<td class="has-text-centered is-capitalized is-flex is-justify-content-center">
				<div class="tags has-addons">
					<span class="tag service is-info has-text-weight-bold is-size-7-mobile">
						<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.auto_release))}></iconify-icon>
						{clientid2name($claims_target_store.claims.auto_release)}
					</span>
					<span class="tag val has-text-weight-bold is-info is-capitalized is-size-7-mobile">
						{$claims_target_store.properties.auto_release}
					</span>
				</div>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.time_limit}
		<tr>
			<td class="has-text-left is-italic is-size-7-mobile">time_limit</td>
			<td class="has-text-centered is-capitalized is-flex is-justify-content-center">
				<div class="tags has-addons">
					<span class="tag service has-text-weight-bold is-info has-text-weight-bold is-size-7-mobile">
						<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.time_limit))}></iconify-icon>
						{clientid2name($claims_target_store.claims.time_limit)}
					</span>
					<span class="tag val is-info is-capitalized is-size-7-mobile">
						{$claims_target_store.properties.time_limit}
					</span>
				</div>
			</td>
		</tr>
		{/if}
		{#if $claims_target_store.claims.energy_limit}
		<tr>
			<td class="has-text-left is-italic is-size-7-mobile	">energy_limit</td>
			<td class="has-text-centered is-capitalized is-flex is-justify-content-center">
				<div class="tags has-addons">
					<span class="tag service is-info has-text-weight-bold is-size-7-mobile">
						<iconify-icon  class="has-text-white mr-1" icon={displayIcon(clientid2name($claims_target_store.claims.energy_limit))}></iconify-icon>
						{clientid2name($claims_target_store.claims.energy_limit)}
					</span>
					<span class="tag val has-text-weight-bold is-info is-capitalized is-size-7-mobile">
						{$claims_target_store.properties.energy_limit}
					</span>
				</div>
			</td>
		</tr>
		{/if}
	</tbody>
</table>
