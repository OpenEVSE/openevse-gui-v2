<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {onMount} from 'svelte'
	import {faCheck, faXmark} from '@fortawesome/free-solid-svg-icons/index.js'
	export let butn_submit = () => {}
	export let state = ""
	export let name = "Submit"
	export let size = ""
	export let width = ""
	export let color = "is-info"

	let butn

	const displaystate = (state) => { 
		if (state != "") {
			butn.blur()
		}
	} 
	


	function getWidth() {
		const _width = butn.clientWidth
		return _width

	}

	onMount(()=> {
		if (width == "") {
			width = name.length + 2 + "ch"
		}
	})


	$: displaystate(state)
	

</script>


<div class="is-inline-block">
	<button style="width:{width};" bind:this={butn} class="my-1 is-justify-content-center button is-outlined {color} {state=="loading"?"is-loading":""} {size}" on:click|preventDefault={butn_submit}>
		{#if state == "" || state == "loading"}
			{name}
		{:else if state == "ok"}
			<Fa class=" has-text-primary" icon={faCheck}/>
		{:else if state == "error"}
			<Fa class=" has-text-danger" icon={faXmark}/>
		{/if}
	</button>
</div>