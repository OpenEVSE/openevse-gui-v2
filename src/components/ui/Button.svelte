<script>
	
	import Loader 				from "./Loader.svelte";
	import {onMount, onDestroy} from 'svelte'
	
	export let butn_submit = () => {}
	export let state = ""
	export let name = null
	export let size = ""
	export let width = ""
	export let color = "is-info"
	export let tooltip = null
	export let icon = null
	export let disabled = false
	export let margin = "mx-1"

	let butn
	let timeout
	let is_overed = false
	let nopointer = false


	onMount(()=> {
		state = ""
		if (width == "" && name) {
			width = name.length + 2 + "ch"
		}
	})

	onDestroy(()=> {
		if (timeout)
			clearTimeout(timeout)
	})


	function changeState() {
		if (state != "") nopointer = true
		if (state=="ok" || state=="error") {
			timeout = setTimeout(() => {
				state = ""
				if (butn) butn.blur()
			}, 1500);
		}
		else if (state == "") nopointer = false
	}
	
	$: state, changeState()
		

</script>
<style>
	.no-pointer {
		cursor: default;
		pointer-events: none;
	}

</style>

<svelte:options accessors/>
<button type="button" bind:this={butn} style="width: {width};"
	class="m-0 button is-inline-block is-outlined has-tooltip-arrow has-tooltip {color} {size} {margin}"
	class:no-pointer={nopointer} {disabled} data-tooltip={tooltip}
	on:click|preventDefault={()=>{ butn_submit(), butn.blur() }} 
	on:mouseenter={() => {is_overed = true}} 
	on:mouseleave={() => {is_overed = false}} 
	>
	<div class="is-flex is-align-items-center is-justify-content-center">
		{#if state == "loading"}
		<Loader size={size == "is-small"? "is-size-5" : "is-size-4"} color="has-text-info" />
		{:else if state == "ok"}
		<iconify-icon inline icon="fa6-solid:check"  class="has-text-primary {size == "is-small"? "is-size-6" : "is-size-5"}"></iconify-icon>
		{:else if state == "error"}
		<iconify-icon inline icon="fa6-solid:xmark"  class="has-text-danger {size == "is-small"? "is-size-6" : "is-size-5"}"></iconify-icon>
		{:else if icon}
		<iconify-icon inline {icon} class="{size == "is-small"? "is-size-5" : "is-size-4"}"></iconify-icon>
		{/if}

		{#if name}
			{#if state == ""}
			<div class="{icon?"ml-2":""} is-capitalized is-inline-block">{name}</div>
			{/if}
		{/if}
	</div>
	
</button>