<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {onMount, onDestroy} from 'svelte'
	import {faCheck, faXmark, faSpinner} from '@fortawesome/free-solid-svg-icons/index.js'
	
	export let butn_submit = () => {}
	export let state = "default"
	export let name = null
	export let size = ""
	export let width = ""
	export let color = "is-info"
	export let tooltip = null
	export let icon = null
	export let disabled = false
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
		if (state!="default") nopointer = true
		if (state=="ok" || state=="error") {
			timeout = setTimeout(() => {
				state = "default"
				if (butn) butn.blur()
			}, 1500);
		}
		else if (state == "default") nopointer = false
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
		class="button is-flex is-flex-direction-column is-justify-content-center is-outlined has-tooltip-arrow has-tooltip {color} {size}"
		class:no-pointer={nopointer} {disabled} data-tooltip={tooltip}
		on:click|preventDefault={()=>{ butn_submit(), butn.blur() }} 
		on:mouseenter={() => {is_overed = true}} 
		on:mouseleave={() => {is_overed = false}} 
		>
		<Fa icon={state=="default"?icon:state == "loading"?faSpinner:state == "ok"?faCheck:faXmark} spin={state=="loading"}
			class="{state == "loading"?is_overed?"has-text-white":"has-text-info":state == "ok"?"has-text-primary":state == "error"?"has-text-danger":""}"
		/>
		{#if name}
			{#if state == "default"}
			<div>{name}</div>
			{/if}
		{/if}
	</button>
</div>