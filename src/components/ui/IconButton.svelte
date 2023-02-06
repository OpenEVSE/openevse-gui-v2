<script>
	import Loader from "./Loader.svelte";
	import { link, location} from "svelte-spa-router"
	
	export let color = "has-text-white"
	export let state = ""
	export let butn_submit = () => {}
	export let tooltip = null
	export let icon
	export let disabled = false
	export let size = ""
	let is_hovered = false

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
	.spnr{
		position:relative;
		left: -3	px;

	}
</style>

<div class="is-inline-block">
	<a href={$location} use:link
	class="m-0 p-0 has-tooltip-arrow has-tooltip {is_hovered?"is-hovered":""} {state=="ok"?"has-text-primary":state=="error"?"has-text-danger":state=="loading"?"has-text-info":color} {disabled?"loading":""}"
	on:click|preventDefault={butn_submit} on:mouseenter={()=>is_hovered = true} on:focus={()=>is_hovered = true} on:mouseleave={()=>is_hovered = false} on:blur={()=>is_hovered = false} data-tooltip={tooltip}>
		<div class="has-text-centered is-flex is-vcentered">
			{#if state == "ok"}
			<iconify-icon inline class="{size}" icon="fa6-solid:check"></iconify-icon>
			{:else if state == "error"}
			<iconify-icon inline class="{size}" icon="fa6-solid:xmark"></iconify-icon>
			{:else if state == "loading"}
			<div class="spnr">
				<iconify-icon inline class="{size}" icon="eos-icons:loading"></iconify-icon>
			</div>
			{:else}
			<iconify-icon inline class="{size}" icon={icon}></iconify-icon>
			{/if}
		</div>
	</a>
</div>