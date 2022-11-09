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

	const displaystate = (state) => { 
		if (state != "default") {
			butn.blur()
		}
	} 

	onMount(()=> {
		if (width == "") {
			width = name.length + 4 + "ch"
		}
	})

	onDestroy(()=> {
		if (timeout)
			clearTimeout(timeout)
	})

	function changeState() {
		if (state!="default") disabled = true
		if (state=="ok" || state=="error") {
			setTimeout(() => {
				state = "default"
			}, 1500);
		}
		else disabled = false
	}
	
	$: displaystate(state), changeState()

		

</script>


<div class="is-inline-block">
	<button style="width:{width}" bind:this={butn} 
		class="button is-justify-content-center is-outlined has-tooltip-arrow has-tooltip {color} {size}" {disabled}
		on:click|preventDefault={butn_submit} data-tooltip={tooltip}>
		<Fa icon={state=="default"?icon:state == "loading"?faSpinner:state == "ok"?faCheck:faXmark} spin={state=="loading"}
			class="{state == "loading"?"has-text-info":state == "ok"?"has-text-primary":state == "error"?"has-text-danger":""}"
		/>
		{#if name}
			{#if state == "default"}
				{name}
			{/if}
		{/if}
	</button>
</div>