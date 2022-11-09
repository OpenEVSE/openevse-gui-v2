<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {onMount} from 'svelte'
	import {faCheck, faXmark, faSpinner} from '@fortawesome/free-solid-svg-icons/index.js'
	export let butn_submit = () => {}
	export let state = ""
	export let name = ""
	export let size = ""
	export let width = ""
	export let color = "is-info"
	export let tooltip = null
	export let icon = null
	export let disabled = false
	let butn

	const displaystate = (state) => { 
		if (state != "") {
			butn.blur()
		}
	} 

	onMount(()=> {
		if (width == "") {
			width = name.length + 4 + "ch"
		}
	})

	function changeState(state) {
		if (state!="") disabled = true
		else disabled = false
	}
	
	$: displaystate(state)
	$: changeState(state)

		

</script>


<div class="is-inline-block">
	<button style="width:{width}" bind:this={butn} 
		class="button my-1 is-justify-content-center is-outlined has-tooltip-arrow has-tooltip {color} {size}" {disabled}
		on:click|preventDefault={butn_submit} data-tooltip={tooltip}>

		{#if state == ""}
			<Fa icon={icon}/>
			{#if name}
			{name}
			{/if}
		{:else if state == "loading"}
			<Fa class="has-text-info" icon={faSpinner} spin/>
		{:else if state == "ok"}
			<Fa class=" has-text-primary" icon={faCheck}/>
		{:else if state == "error"}
			<Fa class=" has-text-danger" icon={faXmark}/>
		{/if}
	</button>
</div>