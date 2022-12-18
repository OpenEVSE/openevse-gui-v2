<script>
	import Loader from "./Loader.svelte";
	import { link, location} from "svelte-spa-router"
	import 'iconify-icon';
	export let color = "has-text-white"
	export let state = ""
	export let butn_submit = () => {}
	export let tooltip = null
	export let icon
	export let disabled = false
	export let size = ""

	function changeState(state) {
		if (state) disabled = true
		else disabled = false
	}

	$: changeState(state)

</script>
<style>
	.loading {
    pointer-events:none;
}
</style>

<a href={$location} use:link
class="m-0 p-0 has-tooltip-arrow has-tooltip {state=="ok"?"has-text-primary":state=="error"?"has-text-danger":state=="loading"?"has-text-info":color} {disabled?"loading":""}"
on:click|preventDefault={butn_submit} data-tooltip={tooltip}>



	{#if state == "ok"}
	<iconify-icon inline class="{size}" icon="fa6-solid:check"></iconify-icon>
	{:else if state == "error"}
	<iconify-icon inline class="{size}" icon="fa6-solid:xmark"></iconify-icon>
	{:else if state == "loading"}
	<div class="mt-1"><Loader /></div>
	
	{:else}
	<iconify-icon inline class="{size}" icon={icon}></iconify-icon>
	{/if}
</a>