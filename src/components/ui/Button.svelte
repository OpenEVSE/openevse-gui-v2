<script>
	
	import Loader 				from "./Loader.svelte";
	import {onMount, onDestroy} from 'svelte'
	
	export let butn_submit = () => {}
	export let state = ""
	export let name = null
	export let size = ""
	export let width = null
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
		if (icon && !width && name) {
			width = name.length + 10 + "ch"
		}
		else if (!width && name) {
			width = name.length + 3 + "ch"
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
<!-- <button bind:this={butn} style:width={width} -->
<button bind:this={butn} style:width={width}
	class="button is-outlined has-tooltip-arrow has-tooltip is-justify-content-center {color} {size} {margin}"
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
		<iconify-icon inline {icon} class="mr-2 {size == "is-small"? "is-size-5" : "is-size-4"}"></iconify-icon>
		{/if}

		{#if name}
			{#if state == ""}
			<span class="{icon?"ml-1":""}">
				{name}
			</span>
			{/if}
		{/if}
	</div>
	
</button>
<!-- <button bind:this={button} class="button is-info is-outlined" on:click={onClick}>
	<iconify-icon icon="fa6-solid:file-export" class="is-size-5" ></iconify-icon>
	<span class="ml-1">Select</span>	  
</button> -->