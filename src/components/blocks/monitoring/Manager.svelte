<script>
	import ManagerTag from "./../../ui/ManagerTag.svelte";
	import { onMount } from "svelte";
	import { claims_target_store } from "./../../../lib/stores/claims_target.js";
	import { _ } 				   from 'svelte-i18n'
	import { clientid2name,
			 displayIcon } 		   from "../../../lib/utils.js"
	
	let mounted = false

	onMount( ()=> mounted = true)
</script>

{#if mounted}
<table class="table is-fullwidth">
	<thead class="is-size-7-mobile">
		<tr class="has-background-info"	>
			<th class="has-text-white has-text-left py-1">{$_("monitoring-manager-prop")}</th>
			<th class="has-text-white has-text-centered py-1" style="width:40%" >
				{$_("monitoring-manager-service")} | {$_("monitoring-manager-val")}
			</th>
		</tr>
	</thead>
	<tbody>
		{#each Object.entries($claims_target_store.claims) as [claim, val], i}
		<tr>
			<td class="has-text-left is-italic is-size-7-mobile">{claim}</td>
			<td class="has-text-centered  is-flex is-justify-content-center">
				<ManagerTag cli={val} val={$claims_target_store.properties[claim]} />
			</td>
		</tr>
		{/each}
	</tbody>
</table>
{/if}