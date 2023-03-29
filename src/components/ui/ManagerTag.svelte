<script>
	import { onMount } from "svelte";
	import { _ } 				   from 'svelte-i18n'
	import { clientid2name,
			 displayIcon} 		   from "./../../lib/utils.js"
	export let cli
	export let val

	let name
	let icon

	onMount(()=> {
		name = clientid2name(cli)
		icon = displayIcon(name)
	})

</script>
<style>
	.tag.service {
		box-sizing: border-box;
		/* width: 12ch; */
	}
	.tag.val {
		box-sizing: border-box;
		width: 10ch;
	}
	.tags { 
		width: 170px;
	}
</style>
<div class="tags has-addons">
	<span class="tag service is-flex is-flex-grow-1 is-justify-content-start service is-size-7-mobile is-info has-text-weight-bold is-capitalized">
			<iconify-icon  class="has-text-white mr-1" icon={icon}></iconify-icon>
			<span>{$_("clients." + name)}</span>		
	</span>
	<span class="tag val has-text-weight-bold is-size-7-mobile {val == "active"?"is-primary":val == "disabled"?"is-dark":"is-dark"} is-capitalized">
		{#if val == "active" || val == "disabled"}
		{$_(val)}
		{:else}
		{val}
		{/if}
	</span>
</div>