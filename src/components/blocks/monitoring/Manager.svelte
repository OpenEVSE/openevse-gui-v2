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
<style>
	.tag.service {
		box-sizing: border-box;
		/* width: 12ch; */
	}
	.tag.val {
		box-sizing: border-box;
		width: 12ch;
	}
	.tags { 
		width: 200px;
	}

</style>

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
			<td class="has-text-centered is-capitalized is-flex is-justify-content-right">
				<ManagerTag cli={val} val={$claims_target_store.properties[claim]} />
			</td>
		</tr>
		{/each}
	</tbody>
</table>
{/if}