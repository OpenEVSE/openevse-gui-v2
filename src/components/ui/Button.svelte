<script>
	import 'iconify-icon';
	import Loader from "./Loader.svelte";
	import {onMount, onDestroy} from 'svelte'
	
	export let butn_submit = () => {}
	export let state = "default"
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
		state = "default"
		if (width == "") {
			width = name.length + 4 + "ch"
		}
	})

	onDestroy(()=> {
		if (timeout)
			clearTimeout(timeout)
	})


	function changeState() {
		if (state!="default" && state != "") nopointer = true
		if (state=="ok" || state=="error") {
			timeout = setTimeout(() => {
				state = "default"
				if (butn) butn.blur()
			}, 1500);
		}
		else if (state == "default" || state == "") nopointer = false
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
<div class="is-inline-block p0">
	<button type="button" style="width:{width}" bind:this={butn} 
		class="button is-flex is-justify-content-center is-outlined has-tooltip-arrow has-tooltip {color} {size} {margin}"
		class:no-pointer={nopointer} {disabled} data-tooltip={tooltip}
		on:click|preventDefault={()=>{ butn_submit(), butn.blur() }} 
		on:mouseenter={() => {is_overed = true}} 
		on:mouseleave={() => {is_overed = false}} 
		>
		{#if state == "loading"}
		<Loader />
		{:else if icon || state != "default"}
		<iconify-icon icon="{state=="default"?icon:state == "ok"?"fa6-solid:check":"fa6-solid:xmark"}"  class="{state == "ok"?"has-text-primary":state == "error"?"has-text-danger":""}  {size == "is-small"? "is-size-5" : "is-size-4"}"></iconify-icon>
		{/if}

		{#if name}
			{#if state == "default"}
			<span class={icon?"ml-1":""}>{name}</span>
			{/if}
		{/if}
	</button>
</div>