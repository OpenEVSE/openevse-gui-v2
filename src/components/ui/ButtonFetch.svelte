<script>
	import Fa from 'svelte-fa/src/fa.svelte'
	import {onMount} from 'svelte'
	import {faCircleCheck, faCircleXmark} from '@fortawesome/free-solid-svg-icons/index.js'
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
	
	function cssVariables(node, variables) {
		setCssVariables(node, variables);
		
		return {
			update(variables) {
				setCssVariables(node, variables);
			}
		}
	}
	function setCssVariables(node, variables) {
		for (const name in variables) {
			node.style.setProperty(`--${name}`, variables[name]);
		}
	}

	onMount(()=> {
		if (width == "") {
			width = name.length + 2 + "ch"
			console.log(width)
		}
	})
	$: displaystate(state)
	

</script>


<div class="is-inline-block">
	<button style="width:{width};" bind:this={butn} class="my-1 is-justify-content-center button is-outlined {color} {state=="loading"?"is-loading":""} {size}" on:click|preventDefault={butn_submit}>
		{name}
	</button>
	<span class="is-size-5">
			{#if state == "ok"}
			<Fa class="mx-2 mt-2 has-text-primary" icon={faCircleCheck}/>
			{:else if state == "error"}
			<Fa class="mx-2 mt-2 has-text-danger" icon={faCircleXmark}/>
			{/if}
	</span>
</div>